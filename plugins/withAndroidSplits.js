const { withAppBuildGradle } = require('@expo/config-plugins');

const withAndroidSplits = (config) => {
    return withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = addSplits(config.modResults.contents);
        } else {
            throw new Error('Cannot add splits to build.gradle because it is not groovy');
        }
        return config;
    });
};

function addSplits(buildGradle) {
    if (buildGradle.includes('splits {')) {
        return buildGradle;
    }

    const splitsConfig = `
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk true
        }
    }
`;

    // Insert inside android { ... } block
    return buildGradle.replace(
        /android\s*{/,
        `android {${splitsConfig}`
    );
}

module.exports = withAndroidSplits;
