// import { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator } from 'react-native';

// export default function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('https://jsonplaceholder.typicode.com/todos/1')
//       .then(response => response.json())
//       .then(json => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <View>
//       {loading ? (
//         <ActivityIndicator size="large" />
//       ) : (
//         <Text>{JSON.stringify(data, null, 2)}</Text>
//       )}
//     </View>
//   );
// }
