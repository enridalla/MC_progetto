import * as SQLite from 'expo-sqlite';

class DBController {
    constructor() {
        this.db = null;
    }

    async openDB() {
        try {
            console.log('Opening DB...');
            this.db = await SQLite.openDatabaseAsync('imageDB.db');
            console.log('Database opened');
            const query = "CREATE TABLE IF NOT EXISTS Image (ID INTEGER PRIMARY KEY, Image TEXT);";
            await this.db.execAsync(query);
            console.log('Table created or already exists');
        } catch (error) {
            console.log('Error in openDB: ' + error);
        }
    }

    async closeDB() {
        if (this.db) {
            console.log('Closing database...');
            this.db.closeAsync();
            this.db = null;
        }
    }

    async saveImage(id, base64Image) {
        if (!this.db) {
            console.log('Database is not open');
            throw new Error('Database is not open');
        }

        if (!id || !base64Image) {
            console.log('Invalid ID or image');
            throw new Error('Invalid ID or image');
        }

        const query = "INSERT INTO Image (ID, Image) VALUES (?, ?);";
        try {
            await this.db.runAsync(query, [id, base64Image]);
            console.log('Image saved');
        } catch (error) {
            console.log('Error saving image: ' + error);
            throw error;
        }
    }

    async getImage(id) {
        if (!this.db) {
            console.log('Database is not open');
            return null;
        }

        try {
            const query = "SELECT * FROM Image WHERE ID = ?;";
            const result = await this.db.getFirstAsync(query, id);
       
            if (result && result.Image) {
                console.log(`Image retrieved with ID: ${id}`);
                return result.Image;
            } else {
                console.log('Image not found');
                return null;
            }
        } catch (error) {
            console.log('Error retrieving image: ' + error);
            throw error;
        }
    }

    /*
    async resetDB() {
        if (!this.db) {
            console.log('Database is not open');
            return;
        }
    
        const getTablesQuery = "SELECT name FROM sqlite_master WHERE type='table';";
        const dropTableQuery = "DROP TABLE IF EXISTS ";
        const createTableQuery = "CREATE TABLE IF NOT EXISTS Image (ID INTEGER PRIMARY KEY, Image TEXT);";
        const selectAllQuery = "SELECT name FROM sqlite_master WHERE type='table';"; 
    
        try {
            // Ottieni tutte le tabelle nel database
            const tables = await this.db.getAllAsync(getTablesQuery);
            console.log('Tables in the database:', tables);
            
            // Elimina tutte le tabelle
            for (const table of tables) {
                const dropQuery = dropTableQuery + table.name;
                await this.db.runAsync(dropQuery);
                console.log(`Table ${table.name} dropped`);
            }
    
            // Crea la tabella 'Image' che ti serve
            await this.db.runAsync(createTableQuery);
            console.log('Table "Image" created');
    
            // Stampa tutte le tabelle dopo la creazione
            const remainingTables = await this.db.getAllAsync(selectAllQuery);
            console.log('Remaining tables:', remainingTables);
            
        } catch (error) {
            console.log('Error while deleting or creating tables: ' + error);
        }
    }
        */

    async printImages() {
        if (!this.db) {
            console.log('Database is not open');
            return;
        }

        const query = "SELECT * FROM Image;";
        try {
            const result = await this.db.getAllAsync(query);
            console.log('Images in DB:', result);
        } catch (error) {
            console.log('Error retrieving images: ' + error);
        }
    }
}

// Crea un'istanza singola (singleton) del DBController
const dbController = new DBController();
export default dbController;
