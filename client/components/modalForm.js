import React from "react";
import { StyleSheet, Text, View, Image, Modal } from "react-native";
import Button from "./button";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/formStyling";
import AsyncStorage from "@react-native-community/async-storage";

import * as yup from "yup";

import { Formik } from "formik";
import { TouchableOpacity, TextInput } from "react-native";

export default function form() {
    const validationSchema = yup.object().shape({
        inviteCode: yup.string().required(),
    });

    const getToken = async () => {
        try {
            //item is given back as string
            return AsyncStorage.getItem("Token");
        } catch (error) {
            console.log("Something went wrong", error);
        }
    };

    const url = "http://159.203.16.113:3000/organizations/join";

    async function joinOrg(info) {
        try {
            const jwt = await getToken();
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(info),
            }).then((response) => response.json());
        } catch (error) {
            console.log(error);
        }

    }



    return(
        <View>
            <Formik 
                initialValues={{ inviteCode: "" }}

				validationSchema={validationSchema}

                onSubmit={(value) => {
                    console.log(value);
                }}>
                    {(formikprops) => (
                        <View>
                            <TextInput
                                style={styles.textboxModal}
                                placeholder="Enter code here"
                                onChangeText={formikprops.handleChange('inviteCode')}
                                value={formikprops.values.inviteCode}>
                    
                            </TextInput>


                            <Text style={{ color: "red" }}>
                                {formikprops.touched.inviteCode && formikprops.errors.inviteCode}
                            </Text>

                            <Button 
                                text="Send Join Request" 
                                onPress={() => {
                                    try {
                                        console.log(formikprops.values);
                                        joinOrg(formikprops.values).then((response) => {
                                            if (!response?.error) {
                                                formikprops.handleSubmit; //submit form
                                                alert("Successfully submitted", response);
                                            } else {
                                                alert(response.error);
                                            }
                                        });
                                    } catch {
                                        alert("Unknown Error");
                                    }
                                }}
                            />
                        </View>
                    )}
            </Formik>

        </View>
        
    )
}
