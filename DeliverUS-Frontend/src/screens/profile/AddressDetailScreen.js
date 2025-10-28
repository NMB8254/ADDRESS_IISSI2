import React from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Switch  } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextSemibold from '../../components/TextSemibold'
import { addAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryTap, brandSuccessDisabled } from '../../styles/GlobalStyles'

const validationSchema = yup.object().shape({
  alias: yup.string().required('El alias es obligatorio'),
  street: yup.string().required('La calle es obligatoria'),
  city: yup.string().required('La ciudad es obligatoria'),
  province: yup.string(),
  zipCode: yup.string()
    .matches(/^[0-9]{5}$/, 'Código postal debe tener 5 dígitos')
    .required('El código postal es obligatorio'),
})

export default function AddAddressScreen({ navigation, route }) {
  const existing = route.params?.address || {}
  const initialValues = {
    id: existing.id || null,
    alias: existing.alias || '',
    street: existing.street || '',
    city: existing.city || '',
    province: existing.province || '',
    zipCode: existing.zipCode || '',
    isDefault: existing.isDefault ?? false
  }

const handleSubmit = async (values) => {
    try {
      await addAddress(values)
      showMessage({ message: 'Dirección guardada', type: 'success' })
      navigation.navigate('AddressScreen', {id: route.params.id  })
    } catch (err) {
      console.log('Address saved:', values)
      console.error('Error saving address:', err)
      showMessage({ message: 'Error guardando dirección', description: err.toString(), type: 'danger' })
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              <TextSemibold textStyle={styles.title}>
                {existing.id ? 'Editar dirección' : 'Nueva dirección'}
              </TextSemibold>

              <InputItem label="Alias" name="alias" placeholder="Casa, Trabajo..." />
              <InputItem label="Calle" name="street" placeholder="Ej: Mejos 1" />
              <InputItem label="Ciudad" name="city" placeholder="Ej: Dos Hermanas" />
              <InputItem label="Provincia" name="province" placeholder="Ej: Sevilla" />
              <InputItem label="Código postal" name="zipCode" placeholder="41700" keyboardType="numeric" />
              
              <View style={styles.toggleContainer}>
                <TextSemibold textStyle={styles.toggleLabel}>
                  Dirección predeterminada
                </TextSemibold>
                <Switch
                  value={values.isDefault}
                  onValueChange={val => setFieldValue('isDefault', val)}
                  thumbColor={values.isDefault ? brandPrimary : brandSuccessDisabled}
                  trackColor={{ true: brandPrimaryTap, false: '#ccc' }}
                />
              </View>
              
              <Pressable
                onPress={handleSubmit}
                disabled={!isValid}
                style={({ pressed }) => [
                  { backgroundColor: pressed ? brandPrimaryTap : brandPrimary },
                  styles.button,
                  !isValid && { backgroundColor: brandSuccessDisabled }
                ]}
              >
                <TextSemibold textStyle={styles.buttonText}>Guardar dirección</TextSemibold>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  toggleContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginTop: 20,
 },
 toggleLabel: {
   fontSize: 16,
 },
})