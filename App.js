import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TextInput, Button, Platform, TouchableOpacity} from 'react-native';
import { CheckBox as RNECheckBox } from '@rneui/themed'; // React Native Elements CheckBox
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker'; // Correct import


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 0, // Adjust top padding for Android devices
    justifyContent: 'flex-start', // Ensure input section doesn't shift to the side
    alignItems: 'center', // Center the content horizontally
  },
  taskListContainer: {
    flex: 1,
    width: '100%', // Ensures that the task list takes up full width without centering
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 0, // Remove whitespace between tasks
  },
  taskText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  inputContainer: {
    flexDirection: 'column', // Stack inputs vertically
    padding: 10,
    marginBottom: 10,
    width: '80%', // Limit width for better alignment
    alignItems: 'center', // Center the input elements
  },
  input: {
    height: 100, // Make the input taller than it is wide
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    textAlignVertical: 'top', // For Android to make text input start from the top
    width: '100%', // Make input field take full width
  },
  dateInputContainer: {
    flexDirection: 'row', // Stack date input fields horizontally
    alignItems: 'center',
    marginBottom: 10,
    width: '100%', // Full width to ensure inputs stack properly
    justifyContent: 'center', // Center date inputs horizontally
  },
  dateInput: {
    width: 80, // Adjust width of the date input fields
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginRight: 10, // Add some space between month, day, and year fields
  },
  timeInputContainer: {
    flexDirection: 'row', // Stack time input fields horizontally
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center', // Center time inputs horizontally
  },
  timeInput: {
    width: 80, // Adjust width of the time input
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginRight: 10, // Add space between time and AM/PM
  },
  addButton: {
    backgroundColor: '#C7E0FF',  // Soft pastel blue
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,  // Ensure the button width is at least 150px
    marginTop: 10,  // Add margin above the button
  },
  addButtonText: {
    fontSize: 24,  // Smaller size for the "+" sign
    color: '#fff',
  },
  picker: {
    width: 120,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 14,
  },
  strikeThroughText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});

export default function App() {
  const [tasks, setTasks] = useState([
    { key: '1', completed: false, description: 'Task 1', date: 'January 01, 2025', time: '12:00 AM' },
    { key: '2', completed: false, description: 'Task 2', date: 'February 02, 2025', time: '01:00 PM' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState({ month: 'January', day: '01', year: '2025' });
  const [newTime, setNewTime] = useState({ time: '12:00', period: 'AM' });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const pastelColors = [
    '#EDC9D4', '#FFD3C9', '#FFF7CF', '#E4F0C9', '#C7E0FF', '#CFCFFF', '#BAC3FF',
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        key: String(tasks.length + 1),
        completed: false,
        description: newTask,
        date: `${newDate.month} ${newDate.day}, ${newDate.year}`,
        time: `${newTime.time} ${newTime.period}`,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
      setNewDate({ month: 'January', day: '01', year: '2025' });
      setNewTime({ time: '12:00', period: 'AM' });
    }
  };

  const toggleTaskCompletion = (key) => {
    setTasks(
      tasks.map(task =>
        task.key === key ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDateConfirm = (date) => {
    setNewDate({
      month: date.toLocaleString('default', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
    });
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = time.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const [timePart, period] = formattedTime.split(' ');
    setNewTime({ time: timePart, period });
    setTimePickerVisibility(false);
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.task, { backgroundColor: pastelColors[index % pastelColors.length] }]}>
      <RNECheckBox
        checked={item.completed}
        onPress={() => toggleTaskCompletion(item.key)}
        containerStyle={{ backgroundColor: item.color }}
      />
      <Text style={[styles.taskText, item.completed && styles.completed]}>
        {item.description}
      </Text>
      <Text style={[styles.taskText, item.completed && styles.completed]}>
        {item.date ? `Date: ${item.date}` : 'No date set'}
      </Text>
      <Text style={[styles.taskText, item.completed && styles.completed]}>
        {item.time ? `Time: ${item.time}` : 'No time set'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.taskListContainer}>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <View style={styles.dateInputContainer}>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <Picker
              selectedValue={newDate.month}
              onValueChange={(itemValue) => setNewDate({ ...newDate, month: itemValue })}
              style={styles.picker}>
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          </TouchableOpacity>
          <TextInput
            style={styles.dateInput}
            keyboardType="numeric"
            value={newDate.day}
            onChangeText={(text) => setNewDate({ ...newDate, day: text })}
            placeholder="DD"
          />
          <TextInput
            style={styles.dateInput}
            keyboardType="numeric"
            value={newDate.year}
            onChangeText={(text) => setNewDate({ ...newDate, year: text })}
            placeholder="YYYY"
          />
        </View>
        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={newTime.time}
            onChangeText={(text) => setNewTime({ ...newTime, time: text })}
            placeholder="HH:MM"
          />
          <Picker
            selectedValue={newTime.period}
            onValueChange={(itemValue) => setNewTime({ ...newTime, period: itemValue })}
            style={styles.picker}>
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </SafeAreaView>
  );
}