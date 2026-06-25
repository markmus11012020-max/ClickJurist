import React from 'react';
import { Image, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const SIZES = {
  sm: { scales: 60, shield: 112, fontSize: 18 },
  md: { scales: 90, shield: 175, fontSize: 24 },
  lg: { scales: 120, shield: 225, fontSize: 28 },
};

const SCALES_URI = 'https://cdn-icons-png.flaticon.com/512/18569/18569911.png';

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  const s = SIZES[size];

  return (
    <View className="items-center">
      <View className="relative items-center justify-center" style={{ width: s.shield, height: s.shield }}>
        <Svg
          width={s.shield}
          height={s.shield}
          viewBox="0 0 200 200"
          style={{ position: 'absolute' }}
        >
          <Path
            d="M65,60 C65,60,50,65,50,85 C50,115,100,145,100,145 C100,145,150,115,150,85 C150,65,135,60,135,60 L65,60 Z"
            fill="rgba(255,255,255,0.08)"
          />
        </Svg>

        <Image
          source={{ uri: SCALES_URI }}
          style={{
            width: s.scales,
            height: s.scales,
            marginTop: s.scales * 0.3,
          }}
          accessibilityLabel="Весы правосудия"
        />
      </View>

      <Text
        className="text-white font-bold tracking-tight mt-4"
        style={{ fontSize: s.fontSize }}
      >
        CLICK
        <Text className="text-brand-cyan">JURIST</Text>
      </Text>

      {showTagline && (
        <Text className="text-brand-muted text-xs font-semibold tracking-widest uppercase mt-2">
          Instant Legal Authority
        </Text>
      )}
    </View>
  );
}
