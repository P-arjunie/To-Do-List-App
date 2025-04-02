import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Switch,
  Image,
  Animated,
  Dimensions,
  Keyboard,
  ScrollView
} from 'react-native';
import { useTheme } from '../context/Theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/authContext';
import { ToDo, createTodo, getTodos, updateTodo, deleteTodo } from '../services/todo';
import TodoItem from '../components/TodoItem';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { Timestamp } from 'firebase/firestore';

type RootStackParamList = {
  Auth: undefined;
  Calendar: undefined;
  Home: undefined; 
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Auth">;
type NavigationProp2 = StackNavigationProp<RootStackParamList, "Calendar">;

// Enhanced color scheme with better contrast
const customColors = {
  light: {
    background: '#F8F9FA',    // Light background
    text: '#212529',          // Dark text for better readability
    primary: '#FFD54F',       // Yellow for buttons
    secondary: '#ADB5BD',     // Medium gray for disabled elements
    card: '#FFFFFF',          // White for cards
    border: '#DEE2E6',        // Light gray for borders
    danger: '#DC3545',        // Red for delete/logout
    accent: '#F06292',        // Pink accent
    accentDark: '#D81B60'     // Darker pink for emphasis
  },
  dark: {
    background: '#121212',    // Dark background
    text: '#E9ECEF',          // Light text for better readability
    primary: '#FFD54F',       // Keep the yellow for buttons
    secondary: '#6C757D',     // Gray for disabled elements
    card: '#1E1E1E',          // Darker gray for cards
    border: '#343A40',        // Border color for dark mode
    danger: '#F87171',        // Lighter red for dark mode
    accent: '#AD1457',        // Dark pink accent
    accentDark: '#D81B60'     // Brighter pink for emphasis
  }
};

// Enhanced motivational quotes
const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "Don't wait. The time will never be just right.",
  "Small progress is still progress.",
  "Focus on progress, not perfection.",
  "The best way to get things done is to simply begin.",
  "Today's to-dos are tomorrow's accomplishments.",
  "Dream big, start small, act now.",
  "Productivity is being able to do things that you were never able to do before."
];

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const navigation2 = useNavigation<NavigationProp2>();
  const { user, logout } = useAuth();
  
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = isDarkMode ? customColors.dark : customColors.light;
  
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [quote, setQuote] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  useEffect(() => {
    // Format current date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
    
    // Select a random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
    
    if (user) {
      fetchTodos();
    }
    
    // Animate content in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
    
    // Keyboard listeners to adjust UI when keyboard appears
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setAddingTask(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // if (newTodoTitle.trim() === '' && newTodoDescription.trim() === '') {
        //   setAddingTask(false);
        // }
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userTodos = await getTodos(user.uid);
      // Sort todos: incomplete first, then by due date
      const sortedTodos = userTodos.sort((a, b) => {
        // First by completion status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by due date (most recent first)
        const dateA = a.dueDate?.toDate() || new Date();
        const dateB = b.dueDate?.toDate() || new Date();
        return dateA.getTime() - dateB.getTime();
      });
      setTodos(sortedTodos);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch todos');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddTodo = async () => {
    if (!user || !newTodoTitle.trim()) return;
  
    try {
      const todoData = {
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        completed: false,
        userId: user.uid,
        updatedAt: new Date() as any,
        dueDate: Timestamp.fromDate(newTodoDueDate),
      };
  
      const todoId = await createTodo(todoData);
  
      const newTodo = { id: todoId, ...todoData, createdAt: new Date() as any };
      
      // Add to top and re-sort the list
      const updatedTodos = [newTodo, ...todos].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const dateA = a.dueDate?.toDate() || new Date();
        const dateB = b.dueDate?.toDate() || new Date();
        return dateA.getTime() - dateB.getTime();
      });
      
      setTodos(updatedTodos);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoDueDate(new Date());
      
      // Dismiss keyboard and hide form
      Keyboard.dismiss();
      setAddingTask(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
      console.error(error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      await updateTodo(id, { completed: !todoToUpdate.completed });
      
      // Update and resort list
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ).sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const dateA = a.dueDate?.toDate() || new Date();
        const dateB = b.dueDate?.toDate() || new Date();
        return dateA.getTime() - dateB.getTime();
      });
      
      setTodos(updatedTodos);
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
      console.error(error);
    }
  };

  const handleEditTodo = async (id: string, newTitle: string, newDescription?: string) => {
    try {
      const updateData: any = { title: newTitle };
      if (newDescription !== undefined) {
        updateData.description = newDescription;
      }
      
      await updateTodo(id, updateData);
      
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, ...updateData } : todo
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTodos();
  };

  const handleLogout = async () => {
    try {
      await logout();
      // The auth context will update the user state to null,
      // which will trigger AppNavigator to show the non-authenticated flow
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
      console.error(error);
    }
  };

  const handleNewTask = () => {
    setAddingTask(true);
  };
  
  const handleCancelNewTask = () => {
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoDueDate(new Date());
    setAddingTask(false);
    Keyboard.dismiss();
  };
  
  // Calculate completion stats
  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Formatted date for display
  const formatDate = (date: Date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Organize todos by due date
  const getTodayTodos = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = todo.dueDate.toDate();
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  };
  
  const getUpcomingTodos = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = todo.dueDate.toDate();
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() > today.getTime();
    });
  };
  
  const getOverdueTodos = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = todo.dueDate.toDate();
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() < today.getTime() && !todo.completed;
    });
  };

  // Count tasks by category
  const todayCount = getTodayTodos().length;
  const upcomingCount = getUpcomingTodos().length;
  const overdueCount = getOverdueTodos().length;

  const todayTodos = getTodayTodos();
  const upcomingTodos = getUpcomingTodos();
  const overdueTodos = getOverdueTodos();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <Animated.View style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        flex: 1
      }}>
        {/* Header with image */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require("../../assets/images/Checklist.png")}  
            style={styles.bannerImage}
          />
          <View style={[styles.bannerOverlay, { backgroundColor: `${colors.text}90` }]}>
            <Text style={styles.quoteText}>{quote}</Text>
          </View>
        </View>
        
        {/* Main ScrollView that contains everything */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
                <Text style={[styles.dateText, { color: colors.text }]}>{currentDate}</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.themeToggle}>
                  <Text style={[styles.themeLabel, { color: colors.text }]}>
                    {isDarkMode ? '🌙' : '☀️'}
                  </Text>
                  <Switch 
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: colors.accent }}
                    thumbColor={colors.primary}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.logoutButton, { backgroundColor: colors.card }]} 
                  onPress={handleLogout}
                >
                  <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Status summary with improved visual */}
            <View style={[styles.statusCard, { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              shadowColor: isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.1)'
            }]}>
              <View style={styles.statusItem}>
                <Text style={[styles.statusValue, { color: colors.accentDark }]}>{totalTasks}</Text>
                <Text style={[styles.statusLabel, { color: colors.text }]}>Total</Text>
              </View>
              <View style={[styles.statusDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statusItem}>
                <Text style={[styles.statusValue, { color: colors.primary }]}>{completedTasks}</Text>
                <Text style={[styles.statusLabel, { color: colors.text }]}>Completed</Text>
              </View>
              <View style={[styles.statusDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statusItem}>
                <Text style={[styles.statusValue, { color: colors.accentDark }]}>{completionRate}%</Text>
                <Text style={[styles.statusLabel, { color: colors.text }]}>Progress</Text>
              </View>
            </View>

            {/* Task categories summary */}
            <View style={styles.categoriesContainer}>
              <TouchableOpacity 
                style={[styles.categoryCard, { 
                  backgroundColor: colors.card,
                  borderColor: overdueCount > 0 ? colors.danger : colors.border
                }]}
              >
                <Text style={[styles.categoryCount, { color: overdueCount > 0 ? colors.danger : colors.text }]}>
                  {overdueCount}
                </Text>
                <Text style={[styles.categoryLabel, { color: colors.text }]}>Overdue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.categoryCard, { 
                  backgroundColor: colors.card,
                  borderColor: todayCount > 0 ? colors.accent : colors.border
                }]}
              >
                <Text style={[styles.categoryCount, { color: todayCount > 0 ? colors.accent : colors.text }]}>
                  {todayCount}
                </Text>
                <Text style={[styles.categoryLabel, { color: colors.text }]}>Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.categoryCard, { 
                  backgroundColor: colors.card,
                  borderColor: upcomingCount > 0 ? colors.primary : colors.border
                }]}
              >
                <Text style={[styles.categoryCount, { color: upcomingCount > 0 ? colors.primary : colors.text }]}>
                  {upcomingCount}
                </Text>
                <Text style={[styles.categoryLabel, { color: colors.text }]}>Upcoming</Text>
              </TouchableOpacity>
            </View>

            {/* Add task button when not adding */}
            {!addingTask && (
              <TouchableOpacity 
                style={[styles.addTaskButton, { backgroundColor: colors.primary }]}
                onPress={handleNewTask}
              >
                <Text style={styles.addTaskButtonText}>+ Add New Task</Text>
              </TouchableOpacity>
            )}
             
            {/* Task input form when adding */}
            {addingTask && (
              <View style={styles.taskFormContainer}>
                <View style={[styles.inputGroup, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.1)'
                }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Task title..."
                    placeholderTextColor={colors.secondary}
                    value={newTodoTitle}
                    onChangeText={setNewTodoTitle}
                    autoFocus={true}
                  />
                  
                  <TextInput
                    style={[styles.input, { 
                      color: colors.text, 
                      borderTopWidth: 1, 
                      borderTopColor: colors.border 
                    }]}
                    placeholder="Task description (optional)..."
                    placeholderTextColor={colors.secondary}
                    value={newTodoDescription}
                    onChangeText={setNewTodoDescription}
                    multiline={true}
                    numberOfLines={2}
                  />
                  
                  <View style={[styles.datePickerRow, { 
                    borderTopWidth: 1, 
                    borderTopColor: colors.border 
                  }]}>
                    <Text style={[styles.dateLabel, { color: colors.text }]}>Due date:</Text>
                    <TouchableOpacity 
                      onPress={() => setShowDatePicker(true)}
                      style={[styles.dateButton, { padding: 10 }]} // Add padding to increase touch target
                    >
                      <Text style={[styles.dateButtonText, { color: colors.accent }]}>
                        {formatDate(newTodoDueDate)}
                      </Text>
                      <Text style={[styles.calendarIcon, { color: colors.accent }]}>📅</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={newTodoDueDate}
                    mode="date"
                    display="default"
                    // In your DateTimePicker onChange handler, modify it like this:
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setNewTodoDueDate(selectedDate);
                      }
                      // Always keep the form open regardless of date selection
                      setAddingTask(true);
                    }}
                  />
                )}
                
                <View style={styles.formButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.cancelButton, { 
                      borderColor: colors.border,
                      backgroundColor: colors.card
                    }]} 
                    onPress={handleCancelNewTask}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.addButton, { 
                      backgroundColor: newTodoTitle.trim() ? colors.primary : colors.secondary 
                    }]} 
                    onPress={handleAddTodo}
                    disabled={!newTodoTitle.trim()}
                  >
                    <Text style={[styles.addButtonText, { 
                      color: newTodoTitle.trim() ? '#000' : '#fff'
                    }]}>
                      Add Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Todo lists section */}
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.message, { color: colors.text }]}>Loading tasks...</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {overdueTodos.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: colors.danger }]}>
                    Overdue
                  </Text>
                  <FlatList
                    data={overdueTodos}
                    keyExtractor={(item) => item.id || ''}
                    renderItem={({ item }) => (
                      <TodoItem
                        todo={item}
                        onToggle={() => handleToggleTodo(item.id!)}
                        onDelete={() => handleDeleteTodo(item.id!)}
                        onEdit={(newTitle) => handleEditTodo(item.id!, newTitle)}
                        colors={colors}
                      />
                    )}
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                  />
                </View>
              )}
              
              {todayTodos.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                    Today
                  </Text>
                  <FlatList
                    data={todayTodos}
                    keyExtractor={(item) => item.id || ''}
                    renderItem={({ item }) => (
                      <TodoItem
                        todo={item}
                        onToggle={() => handleToggleTodo(item.id!)}
                        onDelete={() => handleDeleteTodo(item.id!)}
                        onEdit={(newTitle) => handleEditTodo(item.id!, newTitle)}
                        colors={colors}
                      />
                    )}
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                  />
                </View>
              )}
              
              {upcomingTodos.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                    Upcoming
                  </Text>
                  <FlatList
                    data={upcomingTodos}
                    keyExtractor={(item) => item.id || ''}
                    renderItem={({ item }) => (
                      <TodoItem
                        todo={item}
                        onToggle={() => handleToggleTodo(item.id!)}
                        onDelete={() => handleDeleteTodo(item.id!)}
                        onEdit={(newTitle) => handleEditTodo(item.id!, newTitle)}
                        colors={colors}
                      />
                    )}
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                  />
                </View>
              )}
              
              {todos.length === 0 && (
                <View style={styles.emptyContainer}>
                  <View style={[styles.emptyCard, {
                    backgroundColor: colors.card,
                    borderColor: colors.accent
                  }]}>
                    <Text style={[styles.emptyTitle, { color: colors.accentDark }]}>
                      All Clear!
                    </Text>
                    <Text style={[styles.message, { color: colors.text }]}>
                      You have no tasks yet. Add something to get started!
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 140,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quoteText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  themeLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 15,
    marginVertical: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  statusDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryCard: {
    width: width / 3.5,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  addTaskButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addTaskButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  taskFormContainer: {
    marginVertical: 15,
  },
  inputGroup: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    padding: 15,
    fontSize: 16,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    marginRight: 8,
  },
  calendarIcon: {
    fontSize: 16,
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '500',
    fontSize: 16,
  },
  addButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default HomeScreen;