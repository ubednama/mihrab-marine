import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { X } from "lucide-react-native";

import { Theme } from "@/theme";

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
        description: "Standard for Europe, Far East, and parts of the USA."
    },
    {
        id: "ISNA",
        name: "Islamic Society of North America",
        alias: "ISNA",
        description: "Used in USA, Canada, and parts of UK."
    },
    {
        id: "Egypt",
        name: "Egyptian General Authority of Survey",
        alias: "Egypt",
        description: "Used in Africa, Syria, Lebanon, and Malaysia."
    },
    {
        id: "Makkah",
        name: "Umm al-Qura University, Makkah",
        alias: "Makkah",
        description: "Used in the Arabian Peninsula."
    },
    {
        id: "Karachi",
        name: "University of Islamic Sciences, Karachi",
        alias: "Karachi",
        description: "Used in Pakistan, Bangladesh, India, and Afghanistan."
    },
    {
        id: "Tehran",
        name: "Institute of Geophysics, University of Tehran",
        alias: "Tehran",
        description: "Shi'a method used in Iran and some parts of Iraq."
    },
    {
        id: "Singapore",
        name: "Majlis Ugama Islam Singapura",
        alias: "MUIS",
        description: "Used in Singapore."
    }
];

export const CalculationMethodModal: React.FC<CalculationMethodModalProps> = ({
    isVisible,
    onClose,
    activeTheme,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 max-h-[75vh] justify-center items-center p-4 bg-black/80">
                <View className="w-[90%] rounded-[32px] overflow-hidden shadow-2xl" style={{ backgroundColor: activeTheme.colors.background }}>
                    <View
                        className="w-full h-full absolute top-0 left-0"
                        style={{
                            backgroundColor: activeTheme.colors.background,
                            opacity: 0.98
                        }}
                    />

                    {/* Header */}
                    <View
                        className="flex-row justify-between items-center p-6 border-b"
                        style={{ borderColor: activeTheme.colors.glass.border }}
                    >
                        <View>
                            <Text className="font-bold text-xl tracking-tight" style={{ color: activeTheme.colors.text.primary }}>
                                Calculation Methods
                            </Text>
                            <Text className="text-xs font-bold tracking-widest mt-1 uppercase" style={{ color: activeTheme.colors.primary }}>
                                Choose Convention
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-12 h-12 items-center justify-center rounded-full"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                            <X size={24} color={activeTheme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                        className="w-full"
                        contentContainerStyle={{ padding: 24 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {methods.map((method, index) => (
                            <View
                                key={method.id}
                                className={`mb-6 ${index !== methods.length - 1 ? 'border-b pb-6' : ''}`}
                                style={{ borderColor: activeTheme.colors.glass.border }}
                            >
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="font-bold text-base tracking-wide" style={{ color: activeTheme.colors.text.primary }}>
                                        {method.alias}
                                    </Text>
                                </View>
                                <Text className="text-sm font-medium mb-2 leading-relaxed" style={{ color: activeTheme.colors.text.secondary }}>
                                    {method.name}
                                </Text>
                                <Text className="text-xs leading-5" style={{ color: activeTheme.colors.text.muted }}>
                                    {method.description}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
