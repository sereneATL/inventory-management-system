import moment from 'moment';
import axios from 'axios'
import {
  ChakraProvider,
  VStack,
  Grid,
  theme,
  Button,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Box,
  Select
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { useState, useEffect, useRef, ChangeEvent} from "react"
import { Category, Product } from "./types"
import { EditIcon, DeleteIcon, AddIcon, SearchIcon, CloseIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { ProductForm } from './ProductForm';
import { CategoryForm } from './CategoryForm';
import { FaCross } from 'react-icons/fa';

export const App = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)
  const finalRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isEdit, setIsEdit] = useState<boolean>();
  const [isCategory, setIsCategory] = useState<boolean>();
  const [current, setCurrent] = useState<Product>();
  const toast = useToast()
  const [categoryFilter, setCategoryFilter] = useState<string>()

  const [categories, setCategories] = useState<Category[]>()

  const getCategories = async () => 
      await axios.get(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/categories`)
          .then(response =>setCategories(response.data))

  const getData = async (category?: string) => 
    category ?
    await axios.get(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/products?page=${page}&size=${size}&category_id=${category}`)
    .then(response => {
      setData(response.data.items)
      setPage(response.data.page)
      setTotal(response.data.total)
      setPages(response.data.pages)
      setSize(response.data.size)
    }) :
    await axios.get(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/products?page=${page}&size=${size}`)
    .then(response =>{
      setData(response.data.items)
      setPage(response.data.page)
      setTotal(response.data.total)
      setPages(response.data.pages)
      setSize(response.data.size)
    })

  useEffect(() => {
    getData()
  }, [page])

  useEffect(() => {
    getCategories()
  }, [])

  const onDelete = async () => {
    await axios.delete(`${process.env.API_URL || 'http://localhost:8000/api/v1'}/products/${current?.id}`)
    .then(response => 
      {
        if (response.status === 204){
          getData()
          toast({
            title: 'Successfully deleted product',
            status: 'success',
            isClosable: true,
            })
        } else {
          toast({
            title: 'Failed to delete product',
            status: 'error',
            isClosable: true,
          })
        }
        onClose()
      }
    )
  }

  return (
    <ChakraProvider theme={theme}>
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end"/>
          <VStack spacing={8}>
            <Box width="full" display="flex" justifyContent="end" px={20} gap={6}>
              {categories && categories.length > 0 &&
                  <Select placeholder={'Filter by product category...'}
                      onChange={(event)=>{setCategoryFilter(event?.target?.value)}}
                      value={categoryFilter}
                  >
                      {categories?.map((category)=>
                      <option key={category.id.toString()} value={category.id}>{category.name}</option>)}
                  </Select>
              }
              <Button leftIcon={<SearchIcon />} variant='outline' px={6} colorScheme='blue' onClick={()=>{getData(categoryFilter)}}>
                filter
              </Button>
              {categoryFilter && <Button leftIcon={<CloseIcon />} variant='outline' px={6} colorScheme='gray' onClick={()=>{setCategoryFilter('');getData()}}>
                clear 
              </Button>}
              <Button leftIcon={<AddIcon />} colorScheme='blue' px={6} onClick={()=>{setIsCategory(true); onOpen();}}>
                category
              </Button>
              <Button leftIcon={<AddIcon />} colorScheme='teal' px={6} onClick={()=>{setIsCategory(false); setCurrent(undefined); setIsEdit(true); onOpen();}}>
                product
              </Button>
            </Box>
            <TableContainer border='1px' borderColor='teal' borderRadius="md" ref={finalRef} tabIndex={-1}>
              <Table variant='simple' colorScheme="blue">
                <TableCaption>inventory management system</TableCaption>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th isNumeric>Price</Th>
                    <Th>Category</Th>
                    <Th>Created At</Th>
                    <Th>Updated At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { data ? data.map((product: Product) => {
                    return <Tr key={product.id}>
                      <Td>{product.id}</Td>
                      <Td>{product.name}</Td>
                      <Td>{product.description}</Td>
                      <Td isNumeric>{product.price}</Td>
                      <Td>{product.category.name}</Td>
                      <Td>{moment(product.created_at).format('llll')}</Td>
                      <Td>{moment(product.updated_at).format('llll')}</Td>
                      <Td>
                        <Stack direction='row' spacing={4}>
                          <Button leftIcon={<EditIcon />} colorScheme='teal' variant='outline' onClick={()=>{setCurrent(product); setIsEdit(true); onOpen();}}>
                            Edit
                          </Button>
                          <Button leftIcon={<DeleteIcon />} colorScheme='red' variant='solid'  onClick={()=>{setCurrent(product); setIsEdit(false); onOpen();}}>
                            Delete
                          </Button>
                        </Stack>
                      </Td>
                  </Tr>
                  }) : <Tr></Tr>}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th></Th>
                    <Th></Th>
                    <Th></Th>
                    <Th></Th>
                    <Th></Th>
                    <Th>Count: {total}</Th>
                    <Th>Page {page} / {pages}</Th>
                    <Th>
                      <Button leftIcon={<ArrowLeftIcon />} colorScheme='teal' variant='solid' onClick={()=>{setPage(page-1)}} mr={10} isDisabled={page <= 1}>
                      </Button>
                      <Button rightIcon={<ArrowRightIcon />} colorScheme='teal' variant='solid'  onClick={()=>{setPage(page+1)}} isDisabled={page === pages}>
                      </Button>
                      </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </VStack>
        </Grid>
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            {isCategory ? 
            <>
              <CategoryForm onClose={onClose}/>
            </>
            :
              <>
              <ModalHeader>{isEdit ? (current ? `Edit Product ${current?.id} - ${current?.name}` : 'Create New Product') : 'Delete Product'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {isEdit ?  <ProductForm onClose={onClose} refresh={getData} data={current}/> : `Are you sure you want to delete product ID ${current?.id} - ${current?.name}?`}
                </ModalBody>

                <ModalFooter>
                  {!isEdit && (
                    <>
                    <Button variant='ghost' colorScheme='gray' mr={3} onClick={onClose}>
                        Cancel
                      </Button>
                    <Button colorScheme='red' onClick={onDelete}>Delete</Button></>
                  )}
                </ModalFooter>
              </>}
          </ModalContent>
        </Modal>
    </ChakraProvider>
  )
}

