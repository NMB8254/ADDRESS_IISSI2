import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import TextError from '../../components/TextError'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'


export default function AddressScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [addressToBeDeleted, setAddressToBeDeleted] = useState(null)

   useEffect(() => {
    async function fetchAddresses() {
      try {
      const data = await getAddresses()
      console.log('Fetched addresses:', data)
      setAddresses(data)
    } catch (err) {
      console.error(err)
      showMessage({ message: 'Error fetching addresses', description: err.toString(), type: 'danger' })
      setError(err)
    }

  }
  fetchAddresses()
}, [route])

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id)
      showMessage({ message: 'Dirección eliminada', type: 'success' })
      navigation.navigate('AddressScreen', { })
    } catch (err) {
      showMessage({ message: `Error al eliminar: ${err}`, type: 'danger' })
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await setDefault(id)
      showMessage({ message: 'Dirección establecida como predeterminada', type: 'success' })
      navigation.navigate('AddressScreen', { })
    } catch (err) {
      showMessage({ message: `Error al establecer predeterminada: ${err}`, type: 'danger' })
    }
  }

  const renderAddress = ({ item }) => (
    <View style={styles.addressContainer}>
      <TextSemiBold>{item.alias}</TextSemiBold>
      <TextRegular>{item.street}, {item.city}, {item.province}, {item.zipCode}</TextRegular>
      <View style={styles.actions}>
        <Pressable
          onPress={() => handleSetDefault(item.id)}
          style={({ pressed }) => [
            { padding: 5, borderRadius: 4, backgroundColor: pressed ? brandPrimaryTap : 'transparent' },
          ]}
        >
          <Ionicons name={item.isDefault ? 'star' : 'star-outline'} size={24} color={brandPrimary} />
        </Pressable>
        <Pressable
          //onPress={() => handleDelete(item.id)}
          onPress={() => setAddressToBeDeleted(item.id)}

          style={({ pressed }) => [
            { padding: 5, borderRadius: 4, backgroundColor: pressed ? 'rgba(255,0,0,0.2)' : 'transparent' },
          ]}
        >
          <Ionicons name="trash" size={24} color="red" />
        </Pressable>
      </View>
    </View>
  )

  const renderEmptyList = () => (
    <TextRegular textStyle={styles.emptyList}>No tienes direcciones guardadas.</TextRegular>
  )

  return (
    <View style={styles.container}>
      <TextSemiBold textStyle={styles.title}>Mis direcciones</TextSemiBold>
      {error && <TextError>{error.toString()}</TextError>}
      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={addresses.length === 0 && styles.emptyContainer}
        ListEmptyComponent={renderEmptyList}
      />
      <Pressable
        onPress={() => navigation.navigate('AddressDetailScreen', { id: route.params.id })}
        style={({ pressed }) => [
          { backgroundColor: pressed ? brandPrimaryTap : brandPrimary },
          styles.button,
        ]}
      >
        <TextRegular textStyle={styles.textButtom}>Añadir nueva dirección</TextRegular>
      </Pressable>
      <DeleteModal
       isVisible={addressToBeDeleted !== null}
       onCancel={() => setAddressToBeDeleted(null)}
       onConfirm={() => {
         handleDelete(addressToBeDeleted)
         setAddressToBeDeleted(null)
       }}
     >
       <TextRegular>¿Seguro que quieres eliminar esta dirección?</TextRegular>
     </DeleteModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  addressContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  textButtom: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
  },
  emptyList: {
    textAlign: 'center',
    padding: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})