<template>
  <v-container>
    <div class="d-flex align-center mb-4">
      <v-btn icon to="/config" class="mr-2"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <h1>Edit {{ tableName }}</h1>
    </div>

    <!-- PARENT EDITOR -->
    <v-card class="mb-6 pa-4">
      <div class="subtitle-1 font-weight-bold mb-2">Main Details</div>
      <v-form v-if="parentItem" ref="form">
        <v-row>
           <v-col cols="12" sm="6">
             <v-text-field v-model="parentItem.name" label="Name"></v-text-field>
           </v-col>
           <v-col cols="12" sm="6">
             <v-text-field v-model="parentItem.priority" label="Priority" type="number"></v-text-field>
           </v-col>
           <v-col cols="12">
             <v-textarea v-model="parentItem.description" label="Description" rows="2"></v-textarea>
           </v-col>
           <v-col cols="12">
              <v-text-field v-model="parentItem.thumbnail" label="Thumbnail URL"></v-text-field>
              <img v-if="parentItem.thumbnail" :src="getImageUrl(parentItem.thumbnail)" style="max-height: 50px" class="mt-2" />
           </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="saveParent">Save Main Info</v-btn>
        </v-card-actions>
      </v-form>
      <v-skeleton-loader v-else type="article"></v-skeleton-loader>
    </v-card>

    <!-- CHILDREN LIST (Colors) -->
    <v-card v-if="children">
      <v-card-title>
        Colors / Variations
        <v-spacer></v-spacer>
        <v-btn color="primary" small @click="openChildDialog()">Add Variation</v-btn>
      </v-card-title>

      <v-data-table
        :headers="childHeaders"
        :items="children"
        class="elevation-0"
      >
        <template v-slot:item.color="{ item }">
          <v-chip :color="'#' + item.color" small class="mr-2"></v-chip>
          {{ item.colorName }}
        </template>
        
        <template v-slot:item.image="{ item }">
             <!-- Correctly handle full URL or relative path -->
            <img :src="getImageUrl(item)" style="max-height: 40px; margin-top:5px" />
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openChildDialog(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteChild(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
    
    <!-- CHILD EDIT DIALOG -->
    <v-dialog v-model="childDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Variation</v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="editedChild">
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedChild.colorName" label="Color Name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedChild.price" label="Price" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <!-- Simple Hex Input for now, could use v-color-picker -->
                <v-text-field v-model="editedChild.color" label="Hex Color (no #)"></v-text-field>
                <div :style="{ backgroundColor: '#' + editedChild.color, width: '100%', height: '20px' }"></div>
              </v-col>
               <v-col cols="12">
                 <!-- File Upload -->
                 <v-file-input
                    label="Upload Custom Image (Overrides URL)"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    @change="onFileChange"
                 ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedChild.image" label="Fallback Image Path (e.g. /resources/...)"></v-text-field>
                 <span class="caption grey--text">Preview:</span>
                 <img :src="getImagePreview(editedChild)" style="max-height: 100px; display:block" class="mt-2" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="childDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveChild" :loading="savingChild">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { CONSTANTS } from '@/utils';

export default {
  name: 'EntityEditor',
  data: () => ({
    parentItem: null,
    children: [],
    childDialog: false,
    savingChild: false,
    editedChild: {},
    defaultChild: {
        color: '000000', colorName: 'New Color', price: 0, image: '', custom_image: null, priority: 0
    }
  }),
  computed: {
    tableName() {
      return this.$route.params.table;
    },
    id() {
      return this.$route.params.id;
    },
    childHeaders() {
      return [
        { text: 'Name', value: 'colorName' },
        { text: 'Color', value: 'color' },
        { text: 'Price', value: 'price' },
        { text: 'Image', value: 'image' },
        { text: 'Actions', value: 'actions', sortable: false }
      ];
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    ...mapActions(['fetchTable', 'fetchChildren', 'saveRow', 'deleteRow']),
    
    // For List (accepts item object) or String path (legacy usage)
    getImageUrl(itemOrPath) {
        if (!itemOrPath) return '';
        // Legacy: if string passed
        if (typeof itemOrPath === 'string') {
             if (itemOrPath.startsWith('http')) return itemOrPath;
             return `${CONSTANTS.imageBase}${itemOrPath}`;
        }
        
        // Item passed
        if (itemOrPath.custom_image) {
            return itemOrPath.custom_image; // Base64
        }
        const path = itemOrPath.image;
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${CONSTANTS.imageBase}${path}`;
    },

    // Specific for preview in dialog
    getImagePreview(item) {
        return this.getImageUrl(item);
    },

    onFileChange(file) {
        if (!file) {
            // Do not clear custom_image if they strictly cancelled? 
            // Or maybe clear if they clear input.
            // Let's assume clear if they clear.
            // this.editedChild.custom_image = null; // Careful not to clear existing on edit if they just didn't pick NEW one.
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Vue reactivity issue with new property? use $set if needed
            this.$set(this.editedChild, 'custom_image', reader.result);
        };
    },


    async loadData() {
        // Fetch Parent
        // Optimization: We could fetch single row if API supported it, but fetching all for table is cached/fast enough for now
        // or add GET /api/config/:table/:id endpoint.
        // Let's assume we fetch list and find, or implement single fetch.
        // Given current API, let's fetch list and find.
        const res = await this.fetchTable(this.tableName);
        this.parentItem = res.data.find(r => r.id == this.id);
        
        // Fetch Children
        const childRes = await this.fetchChildren({ tableName: this.tableName, id: this.id });
        this.children = childRes.data;
    },

    async saveParent() {
        try {
            await this.saveRow({ tableName: this.tableName, row: this.parentItem });
            alert('Saved!');
        } catch(e) {
            alert('Error');
        }
    },
    
    openChildDialog(item) {
        if (item) {
            this.editedChild = { ...item };
        } else {
            this.editedChild = { ...this.defaultChild };
            // Auto set FK
            this.editedChild['id' + this.tableName] = this.id;
        }
        this.childDialog = true;
    },

    async saveChild() {
         this.savingChild = true;
         try {
            // Child table name convention
            const childTable = this.tableName + 'Color';
            await this.saveRow({ tableName: childTable, row: this.editedChild });
            await this.loadData();
            this.childDialog = false;
        } catch(e) {
            console.error(e);
            alert('Error saving child: ' + e.message);
        } finally {
            this.savingChild = false;
        }
    },

    async deleteChild(item) {
        if(!confirm('Delete this color?')) return;
        try {
             const childTable = this.tableName + 'Color';
             await this.deleteRow({ tableName: childTable, id: item.id });
             await this.loadData();
        } catch(e) {
            alert('Error');
        }
    }
  }
}
</script>
