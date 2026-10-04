"use client";

import { useCallback, useEffect, useState } from "react";
import { anilistFetch, mapPage } from "./client";
import type { FetchFailure, MediaPage } from "./types";

/**
 * `retry` lives on every branch rather than being intersected on at the return
 * type. Intersecting it afterwards means a caller that narrows on
 * `status === "error"` — which is exactly what a failure state is for — loses
 * the retry and cannot render it.
 */
export type CatalogueState<T> =
  | { status: "loading"; data: null; failure: null; retry: () => void }
  | { status: "ready"; data: T; failure: null; retry: () => void }
  | { status: "error"; data: null; failure: FetchFailure; retry: () => void };

interface Request<T> {
  data: T | null;
  failure: FetchFailure | null;
  /**
   * Separate from `data` because a successful request can legitimately yield
   * nothing — AniList returns `Media: null` for an id it does not have. Deriving
   * "still loading" from `data === null` would spin on that case forever.
   */
  settled: boolean;
  retry: () => void;
}

function useRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  map: (raw: unknown) => T,
): Request<T> {
  const key = JSON.stringify(variables);
  const [attempt, setAttempt] = useState(0);
  /* The attempt each result belongs to, rather than resetting state at the
     top of the effect. Clearing on retry is what "loading" means, but doing it
     with setState in the effect body is a synchronous render cascade — and it
     is unnecessary, because a result from attempt N-1 is simply not the
     current attempt and can be ignored. */
  const [result, setResult] = useState<{
    attempt: number;
    data: T | null;
    failure: FetchFailure | null;
  }>({
    /* -1, not 0: `attempt` starts at 0, and an initial result tagged with the
       current attempt would read as settled on the very first render — before
       the request has even been made — handing callers a "ready" state with
       null data to dereference. */
    attempt: -1,
    data: null,
    failure: null,
  });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const response = await anilistFetch<unknown>(query, JSON.parse(key));
      if (cancelled) return;
      if (!response.ok) {
        setResult({ attempt, data: null, failure: response.failure });
        return;
      }
      try {
        setResult({ attempt, data: map(response.value), failure: null });
      } catch (error) {
        /* A mapper that throws means the response was not the shape the query
           asked for. Surfacing that as a failure is the whole point: silently
           yielding an empty row would read as "nothing is airing". */
        setResult({
          attempt,
          data: null,
          failure: {
            kind: "malformed",
            detail: error instanceof Error ? error.message : "unexpected response shape",
          },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // `key` is the serialised variables; the query is a module constant, and
    // `map` is a module-level function so its identity is stable.
  }, [query, key, attempt, map]);

  const settled = result.attempt === attempt;
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    data: settled ? result.data : null,
    failure: settled ? result.failure : null,
    settled,
    retry,
  };
}

/**
 * Each branch is returned as its own literal rather than computed into one
 * object: a ternary widens `status` to the full union, which then fails to
 * assign to the discriminated type the callers narrow against.
 */
function toState<T>(request: Request<T>): CatalogueState<T> {
  const { data, failure, settled, retry } = request;
  if (failure) return { status: "error", data: null, failure, retry };
  if (settled) return { status: "ready", data: data as T, failure: null, retry };
  return { status: "loading", data: null, failure: null, retry };
}

export function useAniListPage(
  query: string,
  variables: Record<string, unknown> = {},
): CatalogueState<MediaPage> {
  return toState(useRequest(query, variables, mapPage));
}

/** Human-readable failure, so sections do not each invent wording. */
export function describeFailure(failure: FetchFailure): string {
  switch (failure.kind) {
    case "http":
      return failure.status === 429
        ? "The catalogue source is rate-limiting us. Try again shortly."
        : `The catalogue source returned an error (${failure.status}).`;
    case "network":
      return "Could not reach the catalogue source.";
    case "malformed":
      return "The catalogue source sent something unreadable.";
  }
}
