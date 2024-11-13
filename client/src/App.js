import logo from './logo.svg';
import './App.css';
import EventCalendar from './Components/EventCalendar';
import { events } from './utils/event';

function App() {
  
  return (
    <div className="App">
      <EventCalendar events={events}/>
    </div>
  );
}

export default App;
