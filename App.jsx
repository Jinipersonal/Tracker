import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./src/components/MapScreen";
import LocationsScreen from "./src/components/LocationsScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from "react-native";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


   const Tab = createBottomTabNavigator();

   export default function App() {
       return (
         <>
         <StatusBar backgroundColor="#595959" barStyle="light-content" />
           <NavigationContainer>
               <Tab.Navigator  screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Map') {
                            iconName = 'location';  // Map icon
                        } else if (route.name === 'Locations') {
                            iconName = 'list-outline';  // Location icon
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'gray',
                    headerStyle: { backgroundColor:'#595959' },  // Change header background color
                    headerTintColor: 'white', 
                })}>
                   <Tab.Screen name="Map" component={MapScreen} />
                   <Tab.Screen name="Locations" component={LocationsScreen} />
               </Tab.Navigator>
           </NavigationContainer>
           </>
       );
   }
   

