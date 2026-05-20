"""
Image quality metrics for SecureStego.

Used to prove that the stego image is visually indistinguishable
from the original cover image.

Metrics:
  - MSE  (Mean Squared Error): average squared pixel difference
  - PSNR (Peak Signal-to-Noise Ratio): logarithmic fidelity measure

Interpretation:
  - MSE near 0  → images are nearly identical
  - PSNR > 40 dB → considered visually identical
  - PSNR > 50 dB → indistinguishable even with instruments
"""
import math

import numpy as np
from PIL import Image


def compute_mse(image_a: Image.Image, image_b: Image.Image) -> float:
    """
    Compute the Mean Squared Error between two images.

    MSE = (1 / N) * Σ (a_i - b_i)^2  for every pixel channel i.

    A value of 0 means the images are pixel-perfect identical.
    Smaller values mean higher similarity.
    """
    if image_a.size != image_b.size:
        raise ValueError(
            f"Images must have the same dimensions. "
            f"Got {image_a.size} vs {image_b.size}"
        )

    arr_a = np.array(image_a.convert("RGB"), dtype=np.float64)
    arr_b = np.array(image_b.convert("RGB"), dtype=np.float64)

    diff = arr_a - arr_b
    mse = np.mean(diff ** 2)
    return float(mse)


def compute_psnr(image_a: Image.Image, image_b: Image.Image) -> float:
    """
    Compute the Peak Signal-to-Noise Ratio in decibels (dB).

    PSNR = 10 * log10(MAX^2 / MSE)
    where MAX = 255 for 8-bit images.

    Higher is better:
      - 30 dB  → noticeable quality loss
      - 40 dB  → very good, hard to spot differences
      - 50 dB+ → visually identical for all practical purposes
      - inf    → images are pixel-perfect identical (MSE = 0)
    """
    mse = compute_mse(image_a, image_b)

    if mse == 0:
        return float("inf")

    MAX_PIXEL = 255.0
    psnr = 20 * math.log10(MAX_PIXEL / math.sqrt(mse))
    return float(psnr)


def compute_quality_metrics(
    cover: Image.Image, stego: Image.Image
) -> dict:
    """
    Compute all quality metrics in one pass.

    Returns:
        A dict with mse, psnr, and a human-readable quality verdict.
    """
    mse = compute_mse(cover, stego)
    psnr = compute_psnr(cover, stego)

    # Human-readable verdict
    if mse == 0:
        verdict = "Identical"
    elif psnr >= 50:
        verdict = "Imperceptible (excellent)"
    elif psnr >= 40:
        verdict = "Visually identical (very good)"
    elif psnr >= 30:
        verdict = "Acceptable"
    else:
        verdict = "Noticeable degradation"

    return {
        "mse": round(mse, 6),
        "psnr_db": round(psnr, 2) if psnr != float("inf") else None,
        "psnr_label": "∞" if psnr == float("inf") else f"{psnr:.2f} dB",
        "verdict": verdict,
    }