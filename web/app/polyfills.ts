"use client";

if (typeof window !== 'undefined') {
    window.global = window.global ?? window;
    window.Buffer = window.Buffer ?? require('buffer').Buffer;
    window.process = window.process ?? { env: {} };
}
