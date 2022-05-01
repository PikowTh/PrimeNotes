import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import * as Style from '../assets/styles';
import { styles } from './Notes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeletedNotes({ ...props }) {

    const emptyBin = () => {
        Alert.alert(
            'Tout supprimer',
            'Vous êtes sur ? Cela va supprimer définitivement toutes les notes',
            [
                {
                    text: 'Non',
                    onPress: () => ToastAndroid.show('Notes Non Supprimées', ToastAndroid.SHORT),
                    style: 'cancel',
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        let emptyArray = [...props.moveToBin];
                        emptyArray = [];
                        props.setMoveToBin(emptyArray);

                        AsyncStorage.setItem('deletedNotes', JSON.stringify(emptyArray)).then(() => {
                            props.setMoveToBin(emptyArray);
                        }).catch(error => console.log(error));

                        ToastAndroid.show('Notes Supprimées', ToastAndroid.SHORT)
                    }
                }
            ]
        )
    }

    const undoAllNotes = () => {
        let deletedNotes = [...props.moveToBin];
        let notes = [...props.notes]

        deletedNotes.forEach((item, index) => {
            notes.push(item)
        });

        props.setMoveToBin([]);
        props.setNotes(deletedNotes);

        AsyncStorage.setItem('storedNotes', JSON.stringify(notes)).then(() => {
            props.setNotes(notes);
        }).catch(error => console.log(error));

        AsyncStorage.setItem('deletedNotes', JSON.stringify([])).then(() => {
            props.setMoveToBin([]);
        }).catch(error => console.log(error));
    }

    const undoNote = (index) => {
        let getBack = props.moveToBin[index];
        let array = [getBack, ...props.notes];

        props.setNotes(array);

        let newArray = [...props.moveToBin];
        newArray.splice(index, 1);
        props.setMoveToBin(newArray);

        AsyncStorage.setItem('storedNotes', JSON.stringify(array)).then(() => {
            props.setNotes(array);
        }).catch(error => console.log(error));

        AsyncStorage.setItem('deletedNotes', () => {
            return;
        }).catch(error => console.log(error));
    }

    const permanentDelete = (index) => {
        Alert.alert(
            'Supprimer la note',
            'Vous êtes sur ? Cela va supprimer définitivement la note sélectionnée',
            [
                {
                    text: 'No',
                    onPress: () => ToastAndroid.show('Note Non Supprimée', ToastAndroid.SHORT),
                    style: 'cancel',
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        let newArray = [...props.moveToBin];
                        newArray.splice(index, 1);
                        props.setMoveToBin(newArray);

                        AsyncStorage.setItem('deletedNotes', JSON.stringify(newArray)).then(() => {
                            props.setMoveToBin(newArray);
                        }).catch(error => console.log(error));

                        ToastAndroid.show('Note Supprimée', ToastAndroid.SHORT)
                    }
                }
            ]
        )
    }

    return (
        <ScrollView>
            <View style={[styles.notesContainer]}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <TouchableOpacity style={style.emptyButton} onPress={() => undoAllNotes()}>
                        <Text style={style.emptyButtonText}>Tout restaurer</Text>
                    </TouchableOpacity>

                    <Text style={{ fontWeight: '700', fontSize: 18, color: Style.color }}>
                        Total: {props.moveToBin.length}
                    </Text>

                    <TouchableOpacity style={style.emptyButton} onPress={() => emptyBin()}>
                        <Text style={style.emptyButtonText}>Vider</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}></View>

                {
                    props.moveToBin.length === 0 ?
                        <View style={styles.emptyNoteContainer}>
                            <Text style={styles.emptyNoteText}>Liste vide</Text>
                        </View>
                        : props.moveToBin.map((item, index) =>
                            <View style={styles.item} key={index}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={styles.note}>
                                        <Text style={styles.index}> {index + 1}. </Text>
                                        <Text style={styles.text}>{item}</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => undoNote(index)}>
                                        <Text style={styles.delete}>Restaurer</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.dateContainer}>
                                    <Text>{props.date}</Text>

                                    <TouchableOpacity onPress={() => permanentDelete(index)}>
                                        <Text style={styles.delete}>Supprimer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                }
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    emptyButton: {
        backgroundColor: Style.color,
        width: '35%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        marginBottom: 5,
    },
    emptyButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    }
});