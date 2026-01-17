import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import { X } from "lucide-react-native";
import { Theme } from "@/theme";
import { GlassView } from "../common/GlassView";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

interface CalculationMethodModalProps {
    isVisible: boolean;
    onClose: () => void;
    activeTheme: Theme;
}

const methods = [
    {
        id: "MWL",
        name: "Muslim World League",
        alias: "MWL",
        description: "Standard for Europe, Far East, and parts of the USA.",
    },
    {
        id: "ISNA",
        name: "Islamic Society of North America",
        alias: "ISNA",
        description: "Used in USA, Canada, and parts of UK.",
    },
    {
        id: "Egypt",
        name: "Egyptian General Authority of Survey",
        alias: "Egypt",
        description: "Used in Africa, Syria, Lebanon, and Malaysia.",
    },
    {
        id: "Makkah",
        name: "Umm al-Qura University, Makkah",
        alias: "Makkah",
        description: "Used in the Arabian Peninsula.",
    },
    {
        id: "Karachi",
        name: "University of Islamic Sciences, Karachi",
        alias: "Karachi",
        description: "Used in Pakistan, Bangladesh, India, and Afghanistan.",
    },
    {
        id: "Tehran",
        name: "Institute of Geophysics, University of Tehran",
        alias: "Tehran",
        description: "Shi'a method used in Iran and some parts of Iraq.",
    },
    {
        id: "Singapore",
        name: "Majlis Ugama Islam Singapura",
        alias: "MUIS",
        description: "Used in Singapore.",
    },
];

export const CalculationMethodModal: React.FC<
    CalculationMethodModalProps
> = ({ isVisible, onClose }) => {
    const { activeTheme, isDark } = useTheme();

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* GLASS DARK OVERLAY */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-center items-center px-3">
                    {/* MODAL CARD */}
                    <TouchableWithoutFeedback>
                        <View
                            className="overflow-hidden shadow-2xl"
                            style={{
                                width: width * 0.96,
                                maxHeight: height * 0.8,
                            }}
                        >
                            <GlassView
                                intensity={24}
                                tint={isDark ? "dark" : "light"}
                                borderRadius={32}
                            >
                                {/* DARK TINT LAYER */}
                                <View
                                    style={{
                                        backgroundColor: isDark
                                            ? "rgba(10, 10, 10, 0.92)"
                                            : "rgba(252, 252, 252, 0.96)",
                                    }}
                                >
                                    {/* HEADER */}
                                    <View
                                        className="flex-row justify-between items-center border-b p-6"
                                        style={{ borderColor: activeTheme.colors.glass.border }}
                                    >
                                        <View>
                                            <Text
                                                className="font-bold text-xl tracking-tight"
                                                style={{ color: activeTheme.colors.text.primary }}
                                            >
                                                Calculation Methods
                                            </Text>
                                            <Text
                                                className="text-xs font-bold tracking-widest mt-1 uppercase"
                                                style={{ color: activeTheme.colors.primary }}
                                            >
                                                Choose Convention
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={onClose}
                                            className="w-10 h-10 p-2 items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: isDark
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "rgba(0, 0, 0, 0.06)",
                                            }}
                                        >
                                            <X size={20} color={activeTheme.colors.text.primary} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* CONTENT */}
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ padding: 22 }}
                                    >
                                        {methods.map((method, index) => (
                                            <View
                                                key={method.id}
                                                className={` ${index !== methods.length - 1 ? "border-b pb-6 mb-6" : "mb-0"
                                                    }`}
                                                style={{ borderColor: activeTheme.colors.glass.border }}
                                            >
                                                <Text
                                                    className="font-bold text-base tracking-wide mb-1"
                                                    style={{ color: activeTheme.colors.text.primary }}
                                                >
                                                    {method.alias}
                                                </Text>

                                                <Text
                                                    className="text-sm font-medium mb-2 leading-relaxed"
                                                    style={{ color: activeTheme.colors.text.secondary }}
                                                >
                                                    {method.name}
                                                </Text>

                                                <Text
                                                    className="text-xs leading-5"
                                                    style={{ color: activeTheme.colors.text.muted }}
                                                >
                                                    {method.description}
                                                </Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            </GlassView>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
