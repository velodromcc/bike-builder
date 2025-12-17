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
              <v-text-field v-model="parentItem.thumbnail" label="Thumbnail URL or Base64"></v-text-field>
              <v-file-input
                label="Upload Thumbnail"
                accept="image/*"
                prepend-icon="mdi-camera"
                @change="onParentFileChange"
              ></v-file-input>
              <img v-if="parentItem.thumbnail" :src="getImageUrl(parentItem.thumbnail)" style="max-height: 50px" class="mt-2" />
           </v-col>
           
           <!-- FRAMESET SPECIFIC SETTINGS -->
           <v-col cols="12" sm="6" v-if="tableName === 'Frameset'">
              <v-checkbox 
                v-model="parentItem.bar_enabled" 
                label="Bar Enabled" 
                :true-value="1" 
                :false-value="0"
              ></v-checkbox>
           </v-col>
           <v-col cols="12" sm="6" v-if="tableName === 'Frameset'">
              <v-checkbox 
                 v-model="parentItem.seatpost_enabled" 
                 label="Seatpost Enabled"
                 :true-value="1" 
                 :false-value="0"
              ></v-checkbox>
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
          <v-icon small class="mr-2" @click="duplicateChild(item)" title="Duplicate">mdi-content-copy</v-icon>
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

            <!-- GROUPSET PARTS UPLOAD -->
            <v-row v-if="tableName === 'Groupset' && editedChild">
                 <v-col cols="12"><div class="subtitle-2">Groupset Components (Base64)</div></v-col>
                 
                 <v-col cols="12" sm="6" v-for="part in ['imageBack', 'imageFront', 'imageBar', 'imageBrake', 'imageBrakeCapilierFront', 'imageBrakeCapilierRear', 'imageGearShift']" :key="part">
                    <v-file-input
                        :label="part"
                        accept="image/*"
                        dense
                        prepend-icon="mdi-camera"
                        @change="(file) => onPartFileChange(file, part)"
                    ></v-file-input>
                    <img v-if="editedChild[part]" :src="getImageUrl(editedChild[part])" style="max-height: 50px; display:block" class="mt-1" />
                    <!-- Clear button if needed, or just overwrite -->
                 </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="childDialog = false">Cancel</v-btn>
          <!-- Positioner Button -->
          <v-btn 
            v-if="tableName === 'Frameset'" 
            color="purple" 
            text 
            @click="openPositioner(editedChild)"
          >
            <v-icon left>mdi-axis-arrow</v-icon> Arrange Components
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveChild" :loading="savingChild">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- POSITIONER DIALOG -->
    <v-dialog v-model="positionerDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card style="background: #f5f5f5;">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="positionerDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Component Arrangement (Draft)</v-toolbar-title>
          <v-spacer></v-spacer>
          <div style="width: 150px" class="mr-4">
            <v-text-field 
                v-if="parentItem"
                v-model.number="wheelScale" 
                label="Wheel Scale" 
                type="number" 
                step="0.01" 
                dense 
                hide-details 
                dark
                @input="updatePositionerItems"
            ></v-text-field>
          </div>
          <v-toolbar-items>
            <v-btn dark text color="cyan lighten-2" @click="centerComponents" title="Move all parts to center">Gather All</v-btn>
            <v-btn dark text color="orange" @click="resetChildOverrides" title="Clear overrides">Reset Overrides</v-btn>
            <v-btn dark text @click="saveParentAndClose">Save Position</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        
        <v-card-text class="pa-0" style="height: calc(100vh - 64px); background: #eee; position: relative;">
            <!-- Bike Canvas Container -->
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <Bike 
                    v-if="positionerDialog"
                    :width="1700" 
                    :height="1000" 
                    :items="positionerItems"
                    :editable="true"
                    @update-anchor="updateAnchor"
                    style="width: 100%; height: 100%;"
                />
            </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { CONSTANTS, toCamel } from '@/utils';
import Bike from '@/views/Builder/Body/Bike.vue';

const GEOMETRY_COLUMNS = [
    'bar_position_x', 'bar_position_y',
    'wheel_right_x', 'wheel_right_y',
    'wheel_left_x', 'wheel_left_y',
    'wheel_scale', 'tyre_scale',
    'seatpost_x', 'seatpost_y', 'seatpost_scale',
    'groupset_middle_x', 'groupset_middle_y',
    'saddle_x', 'saddle_y',
    'groupset_bar_x', 'groupset_bar_y',
    'groupset_capilier_middle_x', 'groupset_capilier_middle_y',
    'groupset_capilier_rear_x', 'groupset_capilier_rear_y',
    'groupset_capilier_front_x', 'groupset_capilier_front_y',
    'saddle_x', 'saddle_y',
    'wheel_scale'
];

export default {
  name: 'EntityEditor',
  components: { Bike },
  data: () => ({
    childDialog: false,
    parentItem: null,
    children: [],
    savingChild: false,
    editedChild: {},
    defaultChild: {
        color: '000000', colorName: 'New Color', price: 0, image: '', custom_image: null, priority: 0
    },
    // Positioner State
    positionerDialog: false,
    positionerItems: [],
    defaultWheel: null,
    defaultGroupset: null,
    defaultSaddle: null
  }),
  computed: {
    ...mapState(['token']),
    
    wheelScale: {
        get() {
            if (this.editedChild && this.editedChild.id !== this.parentItem.id) {
                return this.editedChild.wheel_scale || this.parentItem.wheel_scale;
            }
            return this.parentItem ? this.parentItem.wheel_scale : 1;
        },
        set(val) {
            if (this.editedChild && this.editedChild.id !== this.parentItem.id) {
                this.$set(this.editedChild, 'wheel_scale', val);
            } else if (this.parentItem) {
                this.$set(this.parentItem, 'wheel_scale', val);
            }
        }
    },

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
    // Pre-fetch default wheel for valid Frameset visualizations
    if (this.tableName === 'Frameset') {
        this.fetchDefaultWheel();
    }
  },
  methods: {
    ...mapActions(['fetchTable', 'fetchChildren', 'saveRow', 'deleteRow']),
    
    // For List (accepts item object) or String path (legacy usage)
    getImageUrl(itemOrPath) {
        if (!itemOrPath) return '';
        // Legacy: if string passed
        if (typeof itemOrPath === 'string') {
             if (itemOrPath.startsWith('http') || itemOrPath.startsWith('data:')) return itemOrPath;
             return `${CONSTANTS.imageBase}${itemOrPath}`;
        }
        
        // Item passed
        if (itemOrPath.custom_image) {
            return itemOrPath.custom_image; // Base64
        }
        const path = itemOrPath.image;
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `${CONSTANTS.imageBase}${path}`;
    },

    // Specific for preview in dialog
    getImagePreview(item) {
        return this.getImageUrl(item);
    },

    onPartFileChange(file, key) {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Assign Base64 directly to the key (e.g. imageBack)
            this.$set(this.editedChild, key, reader.result);
        };
    },

    onFileChange(file) {
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.$set(this.editedChild, 'custom_image', reader.result);
        };
    },

    onParentFileChange(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Store Base64 directly in thumbnail (now LONGTEXT)
            this.$set(this.parentItem, 'thumbnail', reader.result);
        };
    },


    async loadData() {
        const res = await this.fetchTable(this.tableName);
        this.parentItem = res.data.find(r => r.id == this.id);
        
        const childRes = await this.fetchChildren({ tableName: this.tableName, id: this.id });
        this.children = childRes.data;
    },

    async fetchDefaultWheel() {
        // Fetch Wheels to find ID 28 (or first available)
        try {
           const res = await this.fetchTable('Wheel');
           // Try finding ID 28 (Standard choice), else first
           let rawWheel = res.data.find(w => w.id == 28) || res.data[0];
           
           if (rawWheel) {
               const colors = await this.fetchChildren({ tableName: 'Wheel', id: rawWheel.id });
               
               // Transform wheel itself
               this.defaultWheel = toCamel(rawWheel);

               // Attach colors to wheel object for Bike.vue compatibility
               // Bike.vue expects: item.colors = { [colorId]: { color: props } }
               this.defaultWheel.colors = {};
               
               if (colors.data && colors.data.length > 0) {
                   const firstColor = colors.data[0];
                   // Store the ID of the first color to use as default
                   this.defaultWheel.color_id = firstColor.id;
                   
                   this.defaultWheel.colors[firstColor.id] = {
                       color: toCamel(firstColor)
                   };
                   
                   console.log('FetchDefaultWheel: Loaded wheel', this.defaultWheel.id, 'with color', firstColor.id);
               } else {
                   console.warn('FetchDefaultWheel: Wheel found but NO colors');
               }
           }
        } catch (e) {
            console.error("Failed to fetch default wheel", e);
        }
    },

    async fetchDefaultSaddle() {
        try {
           const res = await this.fetchTable('Saddle');
           // Try finding ID 30 (Standard choice), else first
           let rawSaddle = res.data.find(w => w.id == 30) || res.data[0];
           
           if (rawSaddle) {
               const colors = await this.fetchChildren({ tableName: 'Saddle', id: rawSaddle.id });
               
               this.defaultSaddle = toCamel(rawSaddle);
               this.defaultSaddle.colors = {};
               
               if (colors.data && colors.data.length > 0) {
                   const firstColor = colors.data[0];
                   this.defaultSaddle.color_id = firstColor.id;
                   this.defaultSaddle.colors[firstColor.id] = {
                       color: toCamel(firstColor)
                   };
                   console.log('FetchDefaultSaddle: Loaded Saddle', this.defaultSaddle.id, 'with color', firstColor.id);
               }
           }
        } catch (e) {
            console.error("Failed to fetch default saddle", e);
        }
    },

    async fetchDefaultGroupset() {
        try {
           const res = await this.fetchTable('Groupset');
           // Try finding ID 103 (Standard choice), else first
           let rawGS = res.data.find(w => w.id == 103) || res.data[0];
           
           if (rawGS) {
               const colors = await this.fetchChildren({ tableName: 'Groupset', id: rawGS.id });
               
               this.defaultGroupset = toCamel(rawGS);
               this.defaultGroupset.colors = {};
               
               if (colors.data && colors.data.length > 0) {
                   const firstColor = colors.data[0];
                   this.defaultGroupset.color_id = firstColor.id;
                   this.defaultGroupset.colors[firstColor.id] = {
                       color: toCamel(firstColor)
                   };
                   console.log('FetchDefaultGroupset: Loaded GS', this.defaultGroupset.id, 'with color', firstColor.id);
               }
           }
        } catch (e) {
            console.error("Failed to fetch default groupset", e);
        }
    },

    async openPositioner(colorItem) {
        if (this.tableName !== 'Frameset') return;
        
        console.log('OpenPositioner: Starting for Color', colorItem.id);

        if (!this.defaultWheel) {
             console.log('OpenPositioner: Fetching default wheel...');
             await this.fetchDefaultWheel();
        }
        
        if (!this.defaultGroupset) {
             console.log('OpenPositioner: Fetching default groupset...');
             await this.fetchDefaultGroupset();
        }

        if (!this.defaultSaddle) {
             console.log('OpenPositioner: Fetching default saddle...');
             await this.fetchDefaultSaddle();
        }
        
        this.editedChild = colorItem; // Store color context for refactoring
        this.updatePositionerItems();
        
        this.positionerDialog = true;
        console.log('OpenPositioner: Dialog opened');
    },

    updatePositionerItems() {
        if (!this.parentItem || !this.editedChild) return;
        
        const colorItem = this.editedChild;
        
        // Prepare Props
        // 1. Geometry from Parent (Frameset) - Freshly converted to capture updates (e.g. wheel_scale)
        const geometryProps = toCamel(this.parentItem);
        // 2. Visuals from Child (Color)
        const visualProps = toCamel(colorItem);
        
        // Remove null/undefined values from visualProps to allow Parent defaults to shine through
        // CRITICAL: DB returns NULL for unset overrides, which would overwrite Parent values with NULL if passed directly
        Object.keys(visualProps).forEach(key => {
            if (visualProps[key] === null || visualProps[key] === undefined) {
                delete visualProps[key];
            }
        });
        
        // Merge: Geometry + Visuals
        const mergedProps = { ...geometryProps, ...visualProps };
        
        // 1. Frameset (Parent + Color context)
        const frameset = {
            id: this.parentItem.id,
            type: 'framesets',
            item: {
                ...geometryProps, // CRITICAL: Bike.vue reads originX/Y from here
                id: this.parentItem.id,
                type: 'framesets',
                // Mock the structure: item.colors[ ID ] = { color: PROPS }
                colors: {
                    [colorItem.id]: {
                        color: mergedProps
                    }
                }
            },
            color: colorItem.id // Select this color ID
        };

        // 2. Wheel (Child - but we need a default wheel to show context)
        const wheel = this.defaultWheel ? {
            id: this.defaultWheel.id,
            type: 'wheels',
            item: {
                ...this.defaultWheel,
                type: 'wheels' // CRITICAL: Bike.vue needs this for CONSTANTS lookup
            },
            color: this.defaultWheel.color_id
        } : null;
        
        // 3. Groupset
        const groupset = this.defaultGroupset ? {
            id: this.defaultGroupset.id,
            type: 'groupsets',
            item: {
                ...this.defaultGroupset,
                type: 'groupsets'
            },
            color: this.defaultGroupset.color_id
        } : null;

        // 4. Saddle
        const saddle = this.defaultSaddle ? {
            id: this.defaultSaddle.id,
            type: 'saddles',
            item: {
                ...this.defaultSaddle,
                type: 'saddles'
            },
            color: this.defaultSaddle.color_id
        } : null;

        this.positionerItems = [frameset, wheel, groupset, saddle].filter(i => i);
        // console.log('UpdatePositionerItems: Updated');
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
    },

    async duplicateChild(item) {
        if(!confirm('Duplicate this color and all its settings?')) return;
        try {
            // 1. Clone object
            const clone = JSON.parse(JSON.stringify(item));
            
            // 2. Remove ID to trigger INSERT
            delete clone.id;
            
            // 3. Update Name
            clone.colorName = clone.colorName + ' (Copy)';
            
            // 4. Save (Server will handle Company Link automatically)
            const childTable = this.tableName + 'Color';
            await this.saveRow({ tableName: childTable, row: clone });
            
            await this.loadData();
            alert('Duplicated successfully!');
        } catch(e) {
            console.error(e);
            alert('Error duplicating: ' + e.message);
        }
    },

    async saveParentAndClose() {
        // User requested to "always store on the children any override".
        // So we save the editedChild (Color row), not the Parent (Frameset).
        if (this.editedChild && this.tableName === 'Frameset') {
             const childTable = this.tableName + 'Color';
             console.log('SaveParentAndClose: Saving Child Overrides', this.editedChild);
             await this.saveRow({ tableName: childTable, row: this.editedChild });
        } else {
             // Fallback for logic where maybe we aren't editing a child? 
             // But openPositioner is called with colorItem, so editedChild should exist.
             await this.saveParent();
        }
        
        this.positionerDialog = false;
        // Reload data to reflect changes in the main list
        await this.loadData(); 
    },

    async centerComponents() {
        if (!confirm('This will move all components to the center of the canvas. Useful if you lost something. Continue?')) return;
        
        // Canvas is 1700x1000. Center is 850, 500.
        const cx = 850;
        const cy = 500;
        
        GEOMETRY_COLUMNS.forEach(col => {
            if (col.includes('_x')) this.editedChild[col] = cx;
            if (col.includes('_y')) this.editedChild[col] = cy;
        });
        
        // Save and Refresh
        const childTable = this.tableName + 'Color';
        await this.saveRow({ tableName: childTable, row: this.editedChild });
        this.updatePositionerItems();
    },

    async resetChildOverrides() {
        if (!confirm('This will clear specific positioning (Overrides) and revert to Frame defaults. Continue?')) return;
        
        try {
            // 1. Set all geometry cols to null on editedChild
            GEOMETRY_COLUMNS.forEach(col => {
                this.editedChild[col] = null;
            });
            
            // 2. Save Child
             const childTable = this.tableName + 'Color';
             await this.saveRow({ tableName: childTable, row: this.editedChild });
             
             // 3. Update Visuals (Refresh merge)
             this.updatePositionerItems();
             
             alert('Overrides cleared! Now using Parent defaults.');
        } catch (e) {
            console.error(e);
            alert('Failed to reset overrides');
        }
    },
    
    updateAnchor({ anchor, x, y }) {
        // Map visual anchor names to DB columns
        // Bike.vue uses: 'wheelsLeft' (Rear), 'wheelsRight' (Front)
        // Groupsets: 'groupsetsMiddle', 'groupsetsBar', etc.
        
        // Round to integer for clean DB values
        x = Math.round(x);
        y = Math.round(y);
        
        const MAP = {
            'wheelsLeft': ['wheel_left_x', 'wheel_left_y'],
            'wheelsRight': ['wheel_right_x', 'wheel_right_y'],
            'groupsetsMiddle': ['groupset_middle_x', 'groupset_middle_y'],
            'groupsetsBar': ['groupset_bar_x', 'groupset_bar_y'],
            'groupsetsCapilierLeft': ['groupset_capilier_rear_x', 'groupset_capilier_rear_y'],
            'groupsetsCapilierRight': ['groupset_capilier_front_x', 'groupset_capilier_front_y'],
            'groupsetsGear': ['groupset_capilier_middle_x', 'groupset_capilier_middle_y'],
            'saddles': ['saddle_x', 'saddle_y'],
        };
        
        const cols = MAP[anchor];
        if (cols) {
            const [ colX, colY ] = cols;
            // UPDATE CHILD (Overrides), NOT PARENT
            this.$set(this.editedChild, colX, x);
            this.$set(this.editedChild, colY, y);
            console.log(`UpdateAnchor (Child): ${anchor} -> ${colX}=${x}, ${colY}=${y}`);
        } else {
             console.log(`UpdateAnchor: Unknown anchor ${anchor}`);
        }
    }
  }
}
</script>
