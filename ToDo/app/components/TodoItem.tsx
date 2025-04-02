import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  TouchableWithoutFeedback 
} from 'react-native';
import { ToDo } from '../services/todo';

export interface TodoItemProps {
  todo: ToDo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
  //colors for todos
  colors: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
        card: string;
        border: string;
        danger: string;
      };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const customColors = {
    background: '#FFFDE7',    // Light yellow - background
    primary: '#FFD54F',       // Yellow - buttons
    text: '#173E7C',          // Dark blue - text
    border: '#E0E0E0',        // Light gray - borders
    danger: '#FF5252',        // Red - delete 
    card: '#FFFFFF'           // White
  };

  //hanlde delete task 
  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: onDelete,
          style: "destructive"
        }
      ]
    );
  };

  //handle edit task
  const handleEdit = () => {
    if (isEditing) {
      if (editedTitle.trim() !== '') {
        onEdit(editedTitle.trim());
      } else {
        // If empty  keep original title
        setEditedTitle(todo.title);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleLongPress = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <TouchableWithoutFeedback onLongPress={handleLongPress}>
      <View 
        style={[
          styles.container, 
          { backgroundColor: customColors.card, borderColor: customColors.border }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.checkbox, 
            { 
              borderColor: customColors.primary, 
              backgroundColor: todo.completed ? customColors.primary : customColors.card 
            }
          ]} 
          onPress={onToggle}
        >
          {todo.completed && (
            <View style={[styles.checkboxInner, { backgroundColor: '#FFFFFF' }]} />
          )}
        </TouchableOpacity>
        
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { color: customColors.text, borderColor: customColors.primary }
            ]}
            value={editedTitle}
            onChangeText={setEditedTitle}
            autoFocus
            onBlur={handleEdit}
            onSubmitEditing={handleEdit}
          />
        ) : (
          <Text 
            style={[
              styles.title, 
              { color: customColors.text },
              todo.completed && styles.completedTitle
            ]}
            numberOfLines={2}
          >
           {todo.title && todo.dueDate && `${todo.title} - ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(todo.dueDate.toDate())}`}
          </Text>
        )}
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: customColors.primary }]} 
            onPress={handleEdit}
          >
            <Text style={[styles.buttonText, { color: customColors.text }]}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: customColors.danger }]} 
            onPress={handleDelete}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// todolist container
export const TodoListContainer: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <View style={containerStyles.container}>
      <View style={containerStyles.header}>
        <Text style={containerStyles.headerTitle}>My Tasks</Text>
      </View>
      <View style={containerStyles.content}>
        {children}
      </View>
    </View>
  );
};
//task container styles
const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',  
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#173E7C', 
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFDE7',  
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  input: {
    flex: 1,
    padding: 4,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderRadius: 6,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TodoItem;