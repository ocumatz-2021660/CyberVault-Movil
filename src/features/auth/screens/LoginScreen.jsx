import React, {useState} from "react";
import {View, Text, StyleSheet,Image,KeyboardAvoidingView,Platform,ScrollView,Alert} from "react-native"
import {ArrowRight, Mail} from "lucide-react-native"
import { useForm, Controller } from 'react-hook-form'
import Button from "../../../shared/components/common/Button";
import Input from "../../../shared/components/common/Input";
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
                    <Controller
                        control = {control}
                        rules={{ required: "Este campo es obligatorio"}}
                        render={({field: {onChange, value}})=>(
                            <Input
                                label= "USUARIO O CORREO"
                                placeholder="Ej. usuario123"
                                value={value}
                                onChangeText={onChange}
                                error={errors.emailOrUsername?.message}
                                icon={<Mail size={15} color={COLORS.primary_dark}/>}
                                
                            />
                        )}
                        name="emailOrUsername"
                    />
                </View>
                <View>
                    <Button
                        title="Ingresar a mi cuenta"
                        icon={<ArrowRight size={20} color={COLORS.surface} />}
                        onPress={handleSubmit(onSubmit)}
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