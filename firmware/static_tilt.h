#pragma once

#include <math.h>

struct Acceleration
{
    float x;
    float y;
    float z;
};

// Static inclination relative to the gravity direction captured by CAL.
// This does not separate gravity from acceleration caused by vehicle motion.
class StaticTilt
{
public:
    static bool validAcceleration(const Acceleration &value)
    {
        float magnitude = length(value);
        return isfinite(magnitude) && magnitude >= 0.65f && magnitude <= 1.35f;
    }

    bool setReference(const Acceleration &value)
    {
        if (!validAcceleration(value))
        {
            return false;
        }
        float magnitude = length(value);
        baseline = {value.x / magnitude, value.y / magnitude, value.z / magnitude};
        return true;
    }

    const Acceleration &reference() const
    {
        return baseline;
    }

    bool angle(const Acceleration &value, float &degrees) const
    {
        if (!validAcceleration(value))
        {
            return false;
        }
        Acceleration cross = {
            baseline.y * value.z - baseline.z * value.y,
            baseline.z * value.x - baseline.x * value.z,
            baseline.x * value.y - baseline.y * value.x
        };
        float dot = baseline.x * value.x + baseline.y * value.y + baseline.z * value.z;
        degrees = atan2f(length(cross), dot) * 57.2957795131f;
        return isfinite(degrees);
    }

private:
    static float length(const Acceleration &value)
    {
        return sqrtf(value.x * value.x + value.y * value.y + value.z * value.z);
    }

    Acceleration baseline = {0.0f, 0.0f, 1.0f};
};

