#include "../firmware/static_tilt.h"

#include <assert.h>
#include <stdio.h>

void expectAngle(const StaticTilt &tilt, Acceleration acceleration, float expected)
{
    float angle = -1.0f;
    assert(tilt.angle(acceleration, angle));
    assert(fabsf(angle - expected) < 0.002f);
}

void testAllDirections()
{
    StaticTilt tilt;
    expectAngle(tilt, {0, 0, 1}, 0);
    expectAngle(tilt, {0.275637f, 0, 0.961262f}, 16);
    expectAngle(tilt, {-0.275637f, 0, 0.961262f}, 16);
    expectAngle(tilt, {0, 0.275637f, 0.961262f}, 16);
    expectAngle(tilt, {0, -0.275637f, 0.961262f}, 16);
    expectAngle(tilt, {0.3535534f, 0.3535534f, 0.8660254f}, 30);
    expectAngle(tilt, {1, 0, 0}, 90);
    expectAngle(tilt, {0, 0, -1}, 180);
}

void testCalibrationVector()
{
    StaticTilt tilt;
    Acceleration baseline = {0.1736482f, 0, 0.9848078f};
    assert(tilt.setReference(baseline));
    expectAngle(tilt, baseline, 0);
    // Opposite directions at the same absolute inclination must not cancel.
    expectAngle(tilt, {-0.1736482f, 0, 0.9848078f}, 20);
    expectAngle(tilt, {0.4383711f, 0, 0.8987940f}, 16);

    StaticTilt restored;
    assert(restored.setReference(tilt.reference()));
    expectAngle(restored, baseline, 0);
    expectAngle(restored, {-0.1736482f, 0, 0.9848078f}, 20);
    assert(!tilt.setReference({0, 0, 0}));
    expectAngle(tilt, baseline, 0);
}

void testMagnitudeValidation()
{
    StaticTilt tilt;
    float angle;
    assert(!tilt.angle({0, 0, 0}, angle));
    assert(!tilt.angle({0.25f, 1.25f, 1}, angle));
    assert(!tilt.angle({NAN, 0, 1}, angle));
    assert(!tilt.angle({0, INFINITY, 1}, angle));
    // A permissive magnitude gate cannot prove that the device is stationary.
    expectAngle(tilt, {0.4f, 0.7f, 1}, 38.8767f);
}

int main()
{
    testAllDirections();
    testCalibrationVector();
    testMagnitudeValidation();
    puts("PASS: static XYZ tilt, all directions, vector calibration, restored reference, invalid acceleration");
    return 0;
}
