import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } }>({});
  const [tasks, setTasks] = useState<{ id: string; title: string; dueDate: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Today's date

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "todos"));
        
        // Process tasks
        const fetchedTasks = querySnapshot.docs
          .filter(doc => doc.data().dueDate) // Make sure dueDate exists
          .map((doc) => {
            // Handle Firestore timestamp
            const data = doc.data();
            let formattedDueDate = "";
            
            // Handle different timestamp formats
            if (data.dueDate && typeof data.dueDate === 'object') {
              // Firestore timestamp with seconds
              if (data.dueDate.seconds) {
                const dueDate = new Date(data.dueDate.seconds * 1000);
                formattedDueDate = dueDate.toISOString().split("T")[0]; // YYYY-MM-DD
              } 
              // JavaScript Date converted to Firestore
              else if (data.dueDate.toDate) {
                const dueDate = data.dueDate.toDate();
                formattedDueDate = dueDate.toISOString().split("T")[0];
              }
            } else if (data.dueDate) {
              // if it's already a string or other format
              const dueDate = new Date(data.dueDate);
              formattedDueDate = dueDate.toISOString().split("T")[0];
            }
            
            console.log(`Task "${data.title}" Due Date:`, formattedDueDate);
            
            return {
              id: doc.id,
              title: data.title || "Untitled Task",
              dueDate: formattedDueDate,
              description: data.description || "",
            };
          })// Filter out tasks with invalid dates
          .filter(task => task.dueDate); 
        
        console.log("Processed Tasks:", fetchedTasks);
        
        // Mark dates with tasks
        const datesWithTasks: { [key: string]: { marked: boolean; dotColor: string } } = {};
        fetchedTasks.forEach((task) => {
          if (task.dueDate) {
            datesWithTasks[task.dueDate] = { 
              marked: true, 
              dotColor: "#FFD54F" 
            };
          }
        });
        
        setTasks(fetchedTasks);
        
        // Add the selected date marker
        const updatedMarkedDates = {
          ...datesWithTasks,
          [selectedDate]: {
            ...(datesWithTasks[selectedDate] || {}),
            selected: true,
            selectedColor: "#FF5252"
          }
        };
        
        setMarkedDates(updatedMarkedDates);
        console.log("Final Marked Dates:", updatedMarkedDates);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    // Re-fetch when selected date changes
    fetchTasks();
  }, [selectedDate]); 
  
  const handleDayPress = (day: { dateString: string }) => {
    console.log("Selected Day:", day.dateString);
    setSelectedDate(day.dateString);
  };
  
  // Filter tasks for the selected date
  const selectedTasks = tasks.filter(task => task.dueDate === selectedDate);
  console.log("Tasks for selected date:", selectedTasks);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: "#FF5252",
          selectedDayBackgroundColor: "#FF5252",
          arrowColor: "#FFD54F",
          selectedDayTextColor: "#ffffff",
          textDayFontWeight: '600',
          textMonthFontWeight: 'bold',
        }}
      />
      
      {/* Task List for Selected Date */}
      <View style={styles.taskListContainer}>
        <Text style={styles.header}>
          Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>
        
        <FlatList
          data={selectedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.noTask}>No tasks for this date</Text>
            </View>
          }
          contentContainerStyle={selectedTasks.length === 0 ? styles.emptyListContent : null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  taskListContainer: { 
    flex: 1,
    marginTop: 10, 
    marginHorizontal: 10,
    backgroundColor: "#FFFDE7", 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 15,
  },
  header: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "#173E7C",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD54F",
    paddingBottom: 10
  },
  taskItem: { 
    backgroundColor: "#FFD54F", 
    marginVertical: 5, 
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  taskTitle: { 
    fontSize: 16, 
    color: "#173E7C",
    fontWeight: "500"
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  noTask: { 
    fontSize: 16, 
    fontStyle: "italic", 
    color: "#9E9E9E", 
    textAlign: "center" 
  },
});

export default CalendarScreen;