import { useState } from 'react';
import { Image, ActivityIndicator, View, StyleProp, ImageStyle } from 'react-native';

interface OptimizedImageProps {
  src: string | number; // Puede ser require(local) o URI (remoto)
  style: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const OptimizedImage = ({ src, style, resizeMode = 'cover' }: OptimizedImageProps) => {
  const [loading, setLoading] = useState(typeof src === 'string');
  const [error, setError] = useState(false);
  const isRemote = typeof src === 'string';
  
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      {loading && (
        <ActivityIndicator 
          style={{ 
            position: 'absolute',
            zIndex: 1,
            alignSelf: 'center'
          }} 
        />
      )}
      
      {error ? (
        <View style={[
          style, 
          { 
            backgroundColor: '#f5f5f5',
            justifyContent: 'center',
            alignItems: 'center'
          }
        ]}>
          {/* Icono de error o placeholder */}
        </View>
      ) : (
        <Image
          source={isRemote ? { uri: src } : src}
          style={[
            style, 
            { 
              opacity: loading ? 0 : 1,
              resizeMode: resizeMode
            }
          ]}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}
    </View>
  );
};

export default OptimizedImage;