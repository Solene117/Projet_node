<template>
  <div class="py-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex flex-col space-y-8">
        <section class="flex justify-center">
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full min-w-md max-w-md">
            <h2 class="text-xl font-semibold mb-4 text-blue-600 text-center">
              {{ editingLocker ? 'Modifier un casier' : 'Ajouter un casier' }}
            </h2>
            <form @submit.prevent="editingLocker ? updateLocker() : addLocker()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
                <input v-model.number="newLocker.number" type="number" placeholder="Numéro du casier" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <select v-model="newLocker.size" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black">
                  <option disabled value="">Sélectionner une taille</option>
                  <option value="small">Petit</option>
                  <option value="medium">Moyen</option>
                  <option value="large">Grand</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input v-model.number="newLocker.price" type="number" step="0.01" placeholder="Prix en euros" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black" />
              </div>

              <div class="flex gap-3 pt-2">
                <button type="submit"
                  class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  {{ editingLocker ? 'Mettre à jour' : 'Ajouter' }}
                </button>
                <button v-if="editingLocker" type="button" @click="cancelEdit"
                  class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </section>

        <!-- Liste des casiers -->
        <section class="w-max">
          <div class="rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4 text-center">Liste des casiers</h2>

            <div v-if="lockers.length === 0" class="text-center py-8">
              Aucun casier enregistré
            </div>

            <div v-else class="grid grid-cols-4 gap-4 flex-row">
              <div v-for="locker in lockers" :key="locker._id"
                class="flex flex-col items-center p-4 rounded-lg border border-gray-200 transition-colors">
                <div class="flex-1 gap-4">
                  <div class="font-medium">
                    Casier n°{{ locker.number }} :
                  </div>
                  <div class="text-sm">
                    Taille : {{ getSizeLabel(locker.size) }} - Prix : {{ locker.price }} €
                  </div>
                  <div class="text-sm mt-1">
                    Statut :
                    <span :class="{
                      'text-green-600 font-semibold': locker.status === 'free',
                      'text-red-600 font-semibold': locker.status === 'reserved',
                    }">
                      {{ getStatusLabel(locker.status) }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2 mt-4">
                  <button @click="editLocker(locker)"
                    class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Modifier
                  </button>
                  <button @click="deleteLocker(locker._id)"
                    class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const lockers = ref([]);
const newLocker = ref({ number: null, size: '', price: null });
const editingLocker = ref(null);

const getSizeLabel = (size) => {
  const sizeLabels = {
    'small': 'Petit',
    'medium': 'Moyen',
    'large': 'Grand'
  };
  return sizeLabels[size] || size;
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'free':
      return 'Libre';
    case 'reserved':
      return 'Reservé';
    default:
      return 'Inconnu';
  }
}

const fetchLockers = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:3033/api/lockers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    lockers.value = res.data
  } catch (error) {
    console.error('Erreur récupération casiers', error)
  }
}

const addLocker = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:3033/api/lockers',
      newLocker.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    newLocker.value = { number: null, size: '', price: null }
    fetchLockers()
  } catch (error) {
    console.error('Erreur ajout casier', error)
  }
}

const editLocker = (locker) => {
  editingLocker.value = locker._id;
  newLocker.value = {
    number: locker.number,
    size: locker.size,
    price: locker.price,
  };
};

const updateLocker = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3033/api/lockers/${editingLocker.value}`, newLocker.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    editingLocker.value = null;
    newLocker.value = { number: null, size: '', price: null };
    fetchLockers();
  } catch (error) {
    console.error('Erreur modification casier', error);
  }
};

const cancelEdit = () => {
  editingLocker.value = null;
  newLocker.value = { number: null, size: '', price: null };
};

const deleteLocker = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
    await axios.delete(
      `http://localhost:3033/api/lockers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchLockers();
  } catch (error) {
    console.error('Erreur suppression casier', error);
  }
};

onMounted(fetchLockers);
</script>