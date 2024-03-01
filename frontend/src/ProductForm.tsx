import { Field, FieldProps, Form, Formik, useFormik } from "formik";
import { Category, Product } from "./types";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    VStack,
    useToast,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    Select,
  } from '@chakra-ui/react'
import axios from "axios";
import { useEffect, useState } from "react";
export function ProductForm(props: {onClose: () => void, refresh: () => void, data?: Product}) {
    const toast = useToast()
    const [categories, setCategories] = useState<Category[]>()

    const getData = async () => 
        await axios.get(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/categories`)
            .then(response =>setCategories(response.data))

    useEffect(() => {
        getData()
    }, [])

    return (
    <Formik
        initialValues={{
            name: props.data?.name || '',
            description: props.data?.description || '',
            category_id: props.data?.category.id || '',
            price: props.data?.price || '',
        }}
        onSubmit={async (values) => {
            props.data ? await axios.put(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/products/${props.data.id}`, 
            {
                name: values.name,
                description: values.description,
                category_id: values.category_id,
                price: values.price
            })
            .then(response=> 
              {
                if (response.status === 200){
                    toast({
                        title: `Successfully updated product - ${props.data?.id} : ${values.name}`,
                        status: 'success',
                        isClosable: true,
                        })
                    props.refresh()
                } else {
                  toast({
                    title: 'Failed to update product',
                    status: 'error',
                    isClosable: true,
                  })
                }
                props.onClose()
              }
            ).catch(()=> {
                toast({
                    title: 'Failed to update new product',
                    status: 'error',
                    isClosable: true,
                  })
            })
            : await axios.post(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/products`, 
            {
                name: values.name,
                description: values.description,
                category_id: values.category_id,
                price: values.price
            })
            .then(response=> 
              {
                if (response.status === 201){
                  toast({
                    title: `Successfully created new product - ${values.name}`,
                    status: 'success',
                    isClosable: true,
                    })
                    props.refresh()
                } else {
                  toast({
                    title: 'Failed to create new product',
                    status: 'error',
                    isClosable: true,
                  })
                }
                props.onClose()
              }
            ).catch(()=> {
                toast({
                    title: 'Failed to create new product',
                    status: 'error',
                    isClosable: true,
                  })
            })
        }}
    >
        {({ handleSubmit, errors, touched, values, isValid, setFieldValue, initialValues}) => (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="flex-start">
            <FormControl isInvalid={!!errors.name && touched.name} isRequired>
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
            <FormControl isInvalid={!!errors.description && touched.description} isRequired>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Field
                    as={Input}
                    id="description"
                    name="description"
                    type="description"
                    variant="filled"
                    validate={(value: string) => {
                        let error;

                        if (value.length < 12) {
                            error = "Description must be at least 12 characters long";
                        }

                        else if (value.length > 10000) {
                            error = "Description cannot be more than 10000 characters long";
                        }

                        else if (!isNaN(parseInt(value))) {
                            error = "Description cannot consist of only numbers or start with numbers";
                        }

                        return error;
                    }}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                {categories != undefined && categories.length === 0 ? 
                    <Select placeholder={'No categories available. Create new category first.'} isDisabled></Select> :
                    <Select placeholder={'Select category'}
                        onChange={(event)=>{setFieldValue('category_id', event?.target?.value)}}
                        value={values.category_id}
                    >
                        {categories?.map((category)=>
                        <option key={category.id.toString()} value={category.id}>{category.name}</option>)}
                    </Select>
                }
            </FormControl>
            <FormControl isInvalid={!!errors.price && touched.price} isRequired>
                <FormLabel>Price (USD)</FormLabel>
                <NumberInput min={0}  value={values.price} onChange={(value)=>{setFieldValue('price', value)}} precision={2} step={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full" isDisabled={props.data ? (values === initialValues): (!isValid || !values.category_id)}>
                Save
            </Button>
            </VStack>
        </form>
        )}
    </Formik>
    )
  }