import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrpcRouter } from "@rimun/api";
import { inferRouterOutputs } from "@trpc/server";

const SLICE_NAME = "auth";

export type AuthState = UnauthenticatedAuthState | AuthenticatedAuthState;

export type UnauthenticatedAuthState = { isAuthenticated: false };

type LoginPayload = inferRouterOutputs<TrpcRouter>["auth"]["login"];

export type AuthenticatedAuthState = { isAuthenticated: true } & LoginPayload;

export const initialState = { isAuthenticated: false } as AuthState;

export const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    // @ts-ignore
    login: (state, action: PayloadAction<LoginPayload>) => ({
      ...state,
      isAuthenticated: true,
      ...action.payload,
    }),
    logout: () => initialState,
  },
});

export const AuthActions = authSlice.actions;
