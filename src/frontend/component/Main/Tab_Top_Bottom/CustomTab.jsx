import React, { useRef } from 'react';
import { View, Dimensions, Animated, StyleSheet, TouchableOpacity, Text, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../theme/theme';

const { width, height } = Dimensions.get('window');
const TAB_HEIGHT = 90;
const CIRCLE_RADIUS = 46;
const CORNER_RADIUS = 12;

const d = `
M0,${TAB_HEIGHT}
L0,${CORNER_RADIUS}
Q0,0 ${CORNER_RADIUS},0
L${width - CORNER_RADIUS},0
Q${width},0 ${width},${CORNER_RADIUS}
L${width},${TAB_HEIGHT}
Z
`;

const CustomTab = ({ screens, screenTitles, icons, parentScrollEnabled }) => {
    const scrollX = useRef(new Animated.Value(width)).current;
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = React.useState(1);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const handleMomentumScrollEnd = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(newIndex); 
    };

    const handleTabPress = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: index * width, animated: true });
            setActiveIndex(index);
        }
    };

    React.useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: width, animated: false });
        }
    }, []);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                ref={scrollViewRef}
                scrollEnabled={parentScrollEnabled}
            >
                {screens.map((screen, index) => (
                    <View key={index} style={[styles.screen, { width }]}>
                        {screen}
                    </View>
                ))}
            </Animated.ScrollView>

            <View style={styles.tabContainer}>
                <Svg
                    height={TAB_HEIGHT}
                    width={width + 2}
                    style={{ position: 'absolute', bottom: 0 }}
                    viewBox={`0 0 ${width} ${TAB_HEIGHT}`}
                >
                    <Path
                        d={d}
                        fill={theme.colors.primary}
                    />
                </Svg>

                {screens.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.inactiveTab,
                            { left: ((width) / screens.length) * index },
                            { right: ((width) / screens.length) * index }
                        ]}
                        onPress={() => handleTabPress(index)}
                    >
                        <Icon
                            name={icons[index]}
                            size={24}
                            color={theme.colors.white}
                            style={{ marginBottom: 15 }}
                        />
                        <Text style={styles.tabText}>{screenTitles[index]}</Text>
                    </TouchableOpacity>
                ))}

                <Animated.View
                    style={[
                        styles.movableButton,
                        {
                            transform: [
                                {
                                    translateX: scrollX.interpolate({
                                        inputRange: [-CIRCLE_RADIUS / 2, (screens.length - 1) * (width + CIRCLE_RADIUS / 2)],
                                        outputRange: [
                                            width / screens.length / 2 - CIRCLE_RADIUS,
                                            width - CIRCLE_RADIUS * 2,
                                        ],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
<Svg
    height={60}
    width={80 * 2.2}
    viewBox="49 130 50 18.8"
    style={styles.iconBorder}
>
    <Path
        d="m 59.013726,129.18642 c 3.827127,0.2442 6.171532,-0.0923 6.652457,3.86271 0.172099,4.23847 -0.353636,6.23039 2.289018,10.44364 3.362822,6.09088 17.126437,7.87062 21.960258,0 2.288418,-3.50742 2.420258,-6.5642 2.646678,-10.37212 0.918813,-4.00592 2.148826,-3.513 6.652455,-3.8627 z"
        fill={theme.colors.white}
    />
</Svg>

                    {screens.map((_, index) => {
                        const opacity = scrollX.interpolate({
                            inputRange: [
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width,
                            ],
                            outputRange: [0, 1, 1],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.animatedIcon,
                                    { opacity },
                                ]}
                            >
                                <Icon
                                    name={icons[index]}
                                    size={40}
                                    color={theme.colors.white}
                                    style={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: theme.colors.primary,
                                        borderRadius: 40,
                                        borderWidth: 3,
                                        borderColor: theme.colors.white,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 20,
                                    }}
                                />
                            </Animated.View>
                        );
                    })}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.white },
    scrollView: { flex: 1 },
    tabContainer: {
        position: 'absolute',
        bottom: -2,
        left: -1,
        width: '100%',
        height: TAB_HEIGHT,
        justifyContent: 'center',
    },
    svg: { position: 'absolute', bottom: 0 },
    inactiveTab: {
        position: 'absolute',
        bottom: 5,
        width: (width - 10) / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
    },
    tabText: {
        fontSize: theme.fontSizes.normal,
        color: theme.colors.white,
        marginBottom: 5
    },
    movableButton: {
        position: 'absolute',
        bottom: TAB_HEIGHT / 2,
        left: 0,
        height: 80,
        width: 80,
        bottom: 30,
        backgroundColor: theme.colors.white,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0
    },
    animatedIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
    },
    iconBorder: {
        bottom: -10,
        left: 0,
    },
    button: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 0,
    },
    screen:{
        height:height-150
    }
});

export default CustomTab;