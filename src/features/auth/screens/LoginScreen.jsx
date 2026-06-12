import React, {useState} from "react";
import {View, Text, StyleSheet,Image,KeyboardAvoidingView,Platform,ScrollView,Alert} from "react-native"
import { useForm, Controller } from 'react-hook-form'
import Button from "../../../shared/components/common/Button";
import { COLORS, SPACING, FONT_SIZE, FONT_TYPE } from "../../../shared/constants/theme";


const LoginScreen = ({navigation}) =>{
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            emailOrUsername: '',
            password: ''
        }
    });
 
    const onSubmit = async (data) => { 
    }    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}        
        >
            <ScrollView>
                <View>
                    <Button
                        title="Register"
                        onPress={()=> navigation.navigate("Register")}
                        style={styles.button}
                    />
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create ({    
       button: {
        marginTop: SPACING.lg,
    },
}
)

export default LoginScreen;