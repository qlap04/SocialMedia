import { CookieOptions } from "express";

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 2,
    path:'api/v3'
}