import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { UserProvider } from './UserContext';

// Import your components
import Home from './Home'; // Assuming your Home component is defined elsewhere
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Signup from './SIgnup';
import Feeds from './Feeds';
import CreateFeed from './createFeed';
import ProfilePage from './ProfilePage';
import MyComponent from './SocketConnection';
import MessagingComponent from './MessagingComponent';
import Companion from './Companion';
import { OnlineUsersProvider } from './OnlineUsersContext';

// Define initial state
const initialState = {
  isAuthenticated: false
};

// Define reducer function
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

// Create Redux store
const store = createStore(rootReducer);

function App() {
  return (
    <UserProvider>
    <OnlineUsersProvider>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/createFeed" element={<CreateFeed />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/companion" element={<Companion />} /> 
        </Routes>
      </Router>
    </Provider>
    </OnlineUsersProvider>
    </UserProvider>
  );
}

export default App;