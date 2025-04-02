// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   TextInput, 
//   Alert,
//   TouchableWithoutFeedback,
//   Image
// } from 'react-native';
// import { ToDo } from '../services/todo';
// import { useTheme } from '@react-navigation/native';

// interface TodoItemProps {
//   todo: ToDo;
//   onToggle: () => void;
//   onDelete: () => void;
//   onEdit: (newTitle: string) => void;
//   colors: {
//     background: string;
//     text: string;
//     primary: string;
//     secondary: string;
//     card: string;
//     border: string;
//     danger: string;
//   };
// }

// const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTitle, setEditedTitle] = useState(todo.title);

//   // Custom color theme based on your requirements
//   const customColors = {
//     background: '#FFFDE7',    // Light yellow background
//     primary: '#FFD54F',       // Yellow for buttons/primary actions
//     text: '#173E7C',          // Dark blue text
//     border: '#E0E0E0',        // Light gray for borders
//     danger: '#FF5252',        // Red for delete actions
//     card: '#FFFFFF'           // White for card background
//   };

//   const handleDelete = () => {
//     Alert.alert(
//       "Delete Task",
//       "Are you sure you want to delete this task?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: onDelete,
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleEdit = () => {
//     if (isEditing) {
//       if (editedTitle.trim() !== '') {
//         onEdit(editedTitle.trim());
//       } else {
//         // If empty, revert to original title
//         setEditedTitle(todo.title);
//       }
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleLongPress = () => {
//     if (!isEditing) {
//       setIsEditing(true);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onLongPress={handleLongPress}>
//       <View 
//         style={[
//           styles.container, 
//           { backgroundColor: customColors.card, borderColor: customColors.border }
//         ]}
//       >
//         <TouchableOpacity 
//           style={[
//             styles.checkbox, 
//             { 
//               borderColor: customColors.primary, 
//               backgroundColor: todo.completed ? customColors.primary : customColors.card 
//             }
//           ]} 
//           onPress={onToggle}
//         >
//           {todo.completed && (
//             <View style={[styles.checkboxInner, { backgroundColor: '#FFFFFF' }]} />
//           )}
//         </TouchableOpacity>
        
//         {isEditing ? (
//           <TextInput
//             style={[
//               styles.input,
//               { color: customColors.text, borderColor: customColors.primary }
//             ]}
//             value={editedTitle}
//             onChangeText={setEditedTitle}
//             autoFocus
//             onBlur={handleEdit}
//             onSubmitEditing={handleEdit}
//           />
//         ) : (
//           <Text 
//             style={[
//               styles.title, 
//               { color: customColors.text },
//               todo.completed && styles.completedTitle
//             ]}
//             numberOfLines={2}
//           >
//             {todo.title}
//           </Text>
//         )}
        
//         <View style={styles.buttonsContainer}>
//           <TouchableOpacity 
//             style={[styles.actionButton, { backgroundColor: customColors.primary }]} 
//             onPress={handleEdit}
//           >
//             <Text style={[styles.buttonText, { color: customColors.text }]}>
//               {isEditing ? 'Save' : 'Edit'}
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.actionButton, { backgroundColor: customColors.danger }]} 
//             onPress={handleDelete}
//           >
//             <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// // Create a wrapper component that includes the image at the top
// export const TodoListWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
//   return (
//     <View style={wrapperStyles.container}>
//       <View style={wrapperStyles.imageContainer}>
//         <Image 
//           source={{ uri: "../" }}  // Replace with your actual image URL
//           style={wrapperStyles.headerImage}
//           defaultSource={require('../assets/default-todo-header.png')}  // Add a default local image
//         />
//         <View style={wrapperStyles.overlay}>
//           <Text style={wrapperStyles.headerTitle}>My Tasks</Text>
//         </View>
//       </View>
//       <View style={wrapperStyles.content}>
//         {children}
//       </View>
//     </View>
//   );
// };

// const wrapperStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFDE7',  // Light yellow background
//   },
//   imageContainer: {
//     height: 180,
//     width: '100%',
//     position: 'relative',
//   },
//   headerImage: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(23, 62, 124, 0.5)',  // Dark blue overlay with opacity
//     justifyContent: 'flex-end',
//     padding: 20,
//   },
//   headerTitle: {
//     color: '#FFFFFF',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//     marginTop: -20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     backgroundColor: '#FFFDE7',  // Light yellow background
//   },
// });

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//     elevation: 3,
//     borderWidth: 1,
//   },
//   checkbox: {
//     height: 24,
//     width: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxInner: {
//     height: 12,
//     width: 12,
//     borderRadius: 6,
//   },
//   title: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   completedTitle: {
//     textDecorationLine: 'line-through',
//     opacity: 0.6,
//   },
//   input: {
//     flex: 1,
//     padding: 4,
//     borderBottomWidth: 1,
//     fontSize: 16,
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     padding: 8,
//     paddingHorizontal: 12,
//     marginLeft: 8,
//     borderRadius: 6,
//   },
//   buttonText: {
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

// export default TodoItem;
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
import { useTheme } from '@react-navigation/native';

export interface TodoItemProps {
  todo: ToDo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
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

  // Custom color theme based on your requirements
  const customColors = {
    background: '#FFFDE7',    // Light yellow background
    primary: '#FFD54F',       // Yellow for buttons/primary actions
    text: '#173E7C',          // Dark blue text
    border: '#E0E0E0',        // Light gray for borders
    danger: '#FF5252',        // Red for delete actions
    card: '#FFFFFF'           // White for card background
  };

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

  const handleEdit = () => {
    if (isEditing) {
      if (editedTitle.trim() !== '') {
        onEdit(editedTitle.trim());
      } else {
        // If empty, revert to original title
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

// Create a simple TodoList container component that uses the color scheme
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

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',  // Light yellow background
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#173E7C',  // Dark blue header
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFDE7',  // Light yellow background
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