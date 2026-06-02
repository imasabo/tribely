const { withPodfile } = require('@expo/config-plugins');

/**
 * Required by @react-native-firebase when using static frameworks on iOS.
 * @see https://rnfirebase.io/#3-react-native-cli---ios-setup
 */
function withFirebaseIos(config) {
  return withPodfile(config, (config) => {
    let contents = config.modResults.contents ?? '';

    if (!contents.includes('$RNFirebaseAsStaticFramework')) {
      contents = contents.replace(
        'prepare_react_native_project!',
        `prepare_react_native_project!

# @react-native-firebase (Expo)
$RNFirebaseAsStaticFramework = true`
      );
      config.modResults.contents = contents;
    }

    return config;
  });
}

module.exports = withFirebaseIos;
