import { Field, Form, Formik, useFormik } from "formik";
import { Product } from "./types";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    VStack,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast,
  } from '@chakra-ui/react'
import axios from "axios";
export function CategoryForm(props: {onClose: () => void}) {
    const toast = useToast()

    return (
        <>
            <ModalHeader>Add new category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Formik
                    initialValues={{
                        name: '',
                    }}
                    onSubmit={async (values) => {
                        await axios.post(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/categories`, 
                        {
                            name: values.name
                        })
                        .then(response => 
                          {
                            if (response.status === 201){
                              toast({
                                title: `Successfully created new category - ${values.name}`,
                                status: 'success',
                                isClosable: true,
                                })
                            } else {
                              toast({
                                title: 'Failed to create new category',
                                status: 'error',
                                isClosable: true,
                              })
                            }
                            props.onClose()
                          }
                        ).catch(()=> {
                            toast({
                                title: 'Failed to create new category',
                                status: 'error',
                                isClosable: true,
                              })
                        })
                    }}
                >
                    {({ handleSubmit, errors, touched, isValid, values}) => (
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="flex-start">
                            <FormControl isInvalid={!!errors.name && touched.name}>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Field
                                    as={Input}
                                    id="name"
                                    name="name"
                                    type="name"
                                    variant="filled"
                                    validate={(value: string) => {
                                        let error;

                                        if (value.length < 3) {
                                            error = "Name must be at least 3 characters long";
                                        }

                                        else if (value.length > 600) {
                                            error = "Name cannot be more than 600 characters long";
                                        }

                                        else if (!isNaN(parseInt(value))) {
                                            error = "Name cannot consist of only numbers or start with numbers";
                                        }

                                        return error;
                                    }}
                                />
                                <FormErrorMessage>{errors.name}</FormErrorMessage>
                            </FormControl>
                            <Button type="submit" colorScheme="teal" width="full" isDisabled={!values.name || !isValid}>
                                Create
                            </Button>
                        </VStack>
                    </form>
                    )}
                </Formik>
            </ModalBody>
            <ModalFooter />
        </>
    )
  }