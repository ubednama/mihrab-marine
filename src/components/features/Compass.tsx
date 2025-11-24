import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Svg, { G, Line, Circle, Text as SvgText } from "react-native-svg";
import { theme } from "@/theme";

interface CompassProps {
    heading: number;
    qiblaAngle: number;
    size: number;
}

export const Compass = ({ heading, qiblaAngle, size }: CompassProps) => {
    const CENTER = size / 2;

    // --- CONFIGURATION ---
    // Adjust these radii to tune the layout
    const R_DEGREE_TEXT = CENTER - 20;  // Outer ring (Degree numbers)
    const R_TICK_START = CENTER - 35;   // Start of ticks (Outer)
    const R_TICK_END = CENTER - 50;     // End of ticks (Inner)
    const R_CARDINAL_TEXT = CENTER - 75; // Inner ring (N, E, S, W) - Moved further in

    // Rotate the Compass Rose so "N" points to True North
    const compassRotate = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${-heading}deg` }],
        };
    });

    // Helper to calculate position
    const getPosition = (angleDeg: number, radius: number) => {
        const rad = (angleDeg - 90) * (Math.PI / 180);
        return {
            x: CENTER + radius * Math.cos(rad),
            y: CENTER + radius * Math.sin(rad),
        };
    };

    return (
        <View className="justify-center items-center">
            {/* Outer Compass Ring (Rotates to North) */}
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    compassRotate,
                ]}
            >
                <Svg height={size} width={size}>
                    {/* Background Circle */}
                    <Circle
                        cx={CENTER}
                        cy={CENTER}
                        r={R_TICK_START}
                        fill="rgba(30, 41, 59, 0.3)"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                    />

                    {/* --- TICKS --- */}
                    {[...Array(72)].map((_, i) => {
                        const angle = i * 5;
                        const isMajor = i % 9 === 0; // Every 45 degrees
                        const start = getPosition(angle, R_TICK_START);
                        const end = getPosition(angle, isMajor ? R_TICK_END : R_TICK_END + 5);

                        return (
                            <Line
                                key={i}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                stroke={i === 0 ? "#ef4444" : "rgba(255,255,255,0.2)"} // Red for North tick
                                strokeWidth={i === 0 ? 3 : (isMajor ? 2 : 1)}
                                strokeLinecap="round"
                            />
                        );
                    })}

                    {/* --- DEGREE MARKERS (Outer Ring) --- */}
                    {[0, 90, 180, 270].map((deg) => {
                        const pos = getPosition(deg, R_DEGREE_TEXT);
                        return (
                            <SvgText
                                key={deg}
                                x={pos.x}
                                y={pos.y}
                                fill="rgba(255,255,255,0.6)"
                                fontSize="12"
                                fontWeight="600"
                                textAnchor="middle"
                                alignmentBaseline="central"
                            >
                                {deg}°
                            </SvgText>
                        );
                    })}

                    {/* --- CARDINAL POINTS (Inner Ring) --- */}
                    {[
                        { label: "N", angle: 0, color: "#ef4444" },
                        { label: "E", angle: 90, color: "rgba(255,255,255,0.6)" },
                        { label: "S", angle: 180, color: "rgba(255,255,255,0.6)" },
                        { label: "W", angle: 270, color: "rgba(255,255,255,0.6)" },
                    ].map((item) => {
                        const pos = getPosition(item.angle, R_CARDINAL_TEXT);
                        return (
                            <SvgText
                                key={item.label}
                                x={pos.x}
                                y={pos.y}
                                fill={item.color}
                                fontSize={item.label === "N" ? "24" : "18"}
                                fontWeight="800"
                                textAnchor="middle"
                                alignmentBaseline="central"
                                transform={`rotate(${heading}, ${pos.x}, ${pos.y})`} // Counter-rotate to keep upright
                            >
                                {item.label}
                            </SvgText>
                        );
                    })}

                    {/* --- QIBLA POINTER --- */}
                    <G transform={`rotate(${qiblaAngle}, ${CENTER}, ${CENTER})`}>
                        <Line
                            x1={CENTER}
                            y1={CENTER}
                            x2={CENTER}
                            y2={45} // Pointing roughly to the tick ring
                            stroke={theme.colors.primary}
                            strokeWidth="2"
                            strokeDasharray="5, 5"
                        />
                        <Circle cx={CENTER} cy={40} r={8} fill={theme.colors.primary} />
                        <Circle
                            cx={CENTER}
                            cy={40}
                            r={12}
                            stroke={theme.colors.primary}
                            strokeWidth={1}
                            opacity={0.5}
                        />
                    </G>
                </Svg>
            </Animated.View>
        </View>
    );
};
