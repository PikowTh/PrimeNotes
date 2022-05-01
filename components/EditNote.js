import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, TextInput, TouchableOpacity, Text, View, ProgressViewIOSComponent } from 'react-native';
import { styles } from './Notes';

export default function EditNote({navigation, route, ...props}) {

    const {idToEdit, noteToEdit} = route.params;
    const [newEdit, setNewEdit] = useState(noteToEdit);

    const editNote = () => {
        let editedNote = [...props.notes];
        editedNote[idToEdit] = newEdit;
        props.setNotes(editedNote);

        AsyncStorage.setItem('storedNotes', JSON.stringify(editedNote)).then(() => {
            props.setNotes(editedNote);
        }).catch(error => console.log(error));

        navigation.navigate('Notes');
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView
                behavior={[Platform.OS === 'ios' ? 'padding' : 'height', 'padding']}
            >
                <TouchableWithoutFeedback 
                // onPress={Keyboard.dismiss}
                >
                    <View style={{padding: 20, justifyContent: 'space-around'}}>
                        <TextInput
                            style={[styles.input]}
                            multiline={true}
                            placeholder='Saisissez le contenu de la note'
                            value={newEdit.toString()}
                            onChangeText={(text) => setNewEdit(text)}
                        />

                        <TouchableOpacity style={styles.button} onPress={() => editNote()}>
                            <Text style={styles.buttonText}>Modifier</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}