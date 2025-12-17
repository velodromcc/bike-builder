<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1>Database Configuration</h1>
      <v-select
        v-model="selectedTable"
        :items="tables"
        label="Select Table"
        outlined
        dense
        hide-details
        class="ml-4"
        style="max-width: 200px"
        @change="loadData"
      ></v-select>
    </div>

    <v-card v-if="selectedTable">
      <v-card-title>
        {{ selectedTable }} Data
        <v-spacer></v-spacer>
        <v-btn v-if="selectedTable === 'Frameset'" color="primary" class="mr-2" @click="saveOrder" :loading="savingOrder">Save Order</v-btn>
        <v-btn color="primary" @click="openDialog()">Add New Item</v-btn>
      </v-card-title>

      <!-- Draggable Table for All Entities -->
      <v-data-table
        v-if="selectedTable"
        :headers="headers"
        :items="items"
        :loading="loading"
        class="elevation-1"
        :items-per-page="-1"
        hide-default-footer
      >
        <template v-slot:body>
            <draggable v-model="items" tag="tbody" @end="onDragEnd">
                <tr v-for="item in items" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                         <img v-if="item.thumbnail" :src="getImageUrl(item.thumbnail)" style="max-height: 40px; margin-top:5px" />
                    </td>
                    <td>{{ item.priority }}</td>
                    <td>
                        <v-icon small class="mr-2" @click="editRow(item)">mdi-pencil</v-icon>
                        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                        <v-icon small class="ml-2" style="cursor: move">mdi-drag</v-icon>
                    </td>
                </tr>
            </draggable>
        </template>
      </v-data-table>

    </v-card>

    <div v-else class="text-center mt-12 title grey--text">
      Please select a table to begin editing.
    </div>

    <!-- Edit Dialog (Only for simple adds/edits if needed, but we prioritize new editor) -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editedIndex === -1 ? 'New Item' : 'Edit Item' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-for="(value, key) in editedItem" :key="key" cols="12" sm="6">
                <!-- ID is typically not editable -->
                <v-text-field
                  v-if="key !== 'id' && key !=='actions'"
                  v-model="editedItem[key]"
                  :label="key"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { CONSTANTS } from '@/utils';
import draggable from 'vuedraggable';

export default {
  name: 'Config',
  components: {
    draggable
  },
  data: () => ({
    selectedTable: null,
    tables: ['Frameset', 'Wheel', 'Groupset', 'Saddle'],
    loading: false,
    savingOrder: false,
    items: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
       name: '', description: '', priority: 0
    } // Minimal default
  }),
  computed: {
    headers() {
        // Uniform headers for all tables
        return [
            { text: 'Id', value: 'id' },
            { text: 'Name', value: 'name' },
            { text: 'Thumbnail', value: 'thumbnail' },
            { text: 'Priority', value: 'priority' },
            { text: 'Actions', value: 'actions', sortable: false }
        ];
    }
  },
  methods: {
    ...mapActions(['fetchTable', 'saveRow', 'deleteRow']),
    
    getImageUrl(path) {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        // Prepend the external base URL for previews
        return `${CONSTANTS.imageBase}${path}`;
    },
    
    async loadData() {
      if (!this.selectedTable) return;
      this.loading = true;
      try {
        const response = await this.fetchTable(this.selectedTable);
        this.items = response.data;
      } catch (e) {
        console.error(e);
        alert('Error loading data');
      } finally {
        this.loading = false;
      }
    },
    
    onDragEnd() {
        // Force update if needed, but v-model should handle it.
        // The list order is now changed.
    },

    async saveOrder() {
        this.savingOrder = true;
        try {
            // Update priorities: Top item gets highest priority (e.g. 100 or list length)
            let currentPriority = 100;
            
            // Items are in the new visual order (Top to Bottom)
            const updates = this.items.map((item, index) => {
                const newPriority = currentPriority - index;
                return {
                    ...item,
                    priority: newPriority
                };
            });
            
            // Execute updates using the current selected table
            for (const item of updates) {
                await this.saveRow({ 
                    tableName: this.selectedTable, 
                    row: { id: item.id, priority: item.priority } 
                });
            }
            
            await this.loadData();
            alert('Order saved!');
        } catch (e) {
            console.error(e);
            alert('Error saving order');
        } finally {
            this.savingOrder = false;
        }
    },

    editRow(item) {
        // Tables that support Master-Detail view
        const masterDetailTables = ['Frameset', 'Wheel', 'Groupset', 'Saddle'];
        
        if (masterDetailTables.includes(this.selectedTable)) {
            this.$router.push(`/config/${this.selectedTable}/${item.id}`);
        } else {
            this.openDialog(item);
        }
    },

    openDialog(item) {
      if (item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
      } else {
        this.editedIndex = -1;
        // Try to infer structure from first item if possible, else default
        const structure = this.items.length ? Object.keys(this.items[0]).reduce((acc, key) => { acc[key] = ''; return acc;}, {}) : this.defaultItem;
        this.editedItem = Object.assign({}, structure);
        delete this.editedItem.id; // No ID for new
      }
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        await this.saveRow({ tableName: this.selectedTable, row: this.editedItem });
        await this.loadData(); // Reload to get fresh IDs etc
        this.close();
      } catch (e) {
        console.error(e);
        alert('Error saving row');
      }
    },

    async deleteItem(item) {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await this.deleteRow({ tableName: this.selectedTable, id: item.id });
          await this.loadData();
        } catch (e) {
          console.error(e);
          alert('Error deleting item');
        }
      }
    }
  }
}
</script>
