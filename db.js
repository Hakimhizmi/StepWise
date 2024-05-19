import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('StepWiseDB.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Users table creation
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          UserID INTEGER PRIMARY KEY AUTOINCREMENT,
          UserName TEXT NOT NULL
        );`,
        [],
        (_, success) => {
          // Categories table creation
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS categories (
              CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
              Name TEXT NOT NULL
            );`,
            [],
            (_, success) => {
              // Projects table creation
              tx.executeSql(
                `CREATE TABLE IF NOT EXISTS projects (
                  ProjectID INTEGER PRIMARY KEY AUTOINCREMENT,
                  Title TEXT NOT NULL,
                  IsSaved INTEGER DEFAULT 0,
                  CreationDate TEXT NOT NULL,
                  CategoryID INTEGER DEFAULT null,
                  FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID)
                );`,
                [],
                (_, success) => {
                  // Steps table creation
                  tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS steps (
                      StepID INTEGER PRIMARY KEY AUTOINCREMENT,
                      Notes TEXT NOT NULL,
                      ImagePath TEXT,
                      Date TEXT NOT NULL,
                      Position INTEGER NOT NULL,
                      ProjectID INTEGER,
                      FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID)
                    );`,
                    [],
                    resolve, // Resolve the promise if successful
                    (_, error) => {
                      reject(error); // Reject the promise in case of an error
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};

export const checkIfDatabaseExists = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Check if 'users' table exists
        tx.executeSql(
          'SELECT name FROM sqlite_master WHERE type="table" AND name="users"',
          [],
          (_, { rows }) => {
            const tableExists = rows.length > 0;
            if (tableExists) {
              // 'users' table exists, check if it has data
              tx.executeSql(
                'SELECT * FROM users',
                [],
                (_, { rows }) => {
                  if (rows.length > 0) {
                    const user = rows.item(0);
                    resolve(user.UserName);
                  } else {
                    resolve(false);
                  }
                },
                (_, error) => reject(error)
              );
            } else {
              resolve(false); // 'users' table does not exist
            }
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const insertUser = (username) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO users (UserName) VALUES (?)',
          [username],
          (_, { insertId }) => {
            resolve(insertId); // Returns the ID of the inserted row
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

//------------------------- Category ----------------------------------------------------------
export const insertCategory = (name) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Check if the category already exists in the table
        tx.executeSql(
          'SELECT * FROM categories WHERE Name = ?',
          [name],
          (_, { rows }) => {
            if (rows.length > 0) {
              reject("Category already exists!"); // Reject if category already exists
            } else {
              // If category doesn't exist, insert it into the table
              tx.executeSql(
                'INSERT INTO categories (Name) VALUES (?)',
                [name],
                (_, { insertId }) => {
                  resolve(insertId); // Returns the ID of the inserted row
                },
                (_, error) => reject(error)
              );
            }
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM categories',
          [],
          (_, { rows }) => {
            const categories = rows._array; // Extracting categories from the result rows
            resolve(categories); // Resolve with the array of categories
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

//------------------------- Project ----------------------------------------------------------

export const insertProject = (Title, CategoryID) => {
  const dateNow = new Date();
  const formattedDate = format(dateNow, "d MMM yyyy 'at' HH:mm");
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO projects (Title, CategoryID, CreationDate) VALUES (?, ?, ?)',
          [Title, CategoryID || null, formattedDate],
          (_, { insertId }) => {
            resolve(insertId); // Returns the ID of the inserted row
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const getProjects = (CategoryID) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        let query = `SELECT 
          projects.*, 
          categories.Name AS CategoryName, 
          (SELECT ImagePath FROM steps WHERE steps.ProjectID = projects.ProjectID AND ImagePath IS NOT NULL LIMIT 1) AS Image,
          (SELECT COUNT(*) FROM steps WHERE steps.ProjectID = projects.ProjectID) AS StepCount,
          (SELECT COUNT(*) FROM steps WHERE steps.ProjectID = projects.ProjectID AND steps.ImagePath IS NOT NULL) AS ImageCount
        FROM projects 
        LEFT JOIN categories ON projects.CategoryID = categories.CategoryID`;

        const params = [];
        if (CategoryID !== null) {
          query += ` WHERE projects.CategoryID = ?`;
          params.push(CategoryID);
        }

        // Order by the most recently created project first
        query += ` ORDER BY projects.ProjectID ASC`;

        tx.executeSql(
          query,
          params,
          (_, { rows }) => {
            const projects = rows._array;
            resolve(projects);
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const DeleteProject = async (projectId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // First, fetch all steps to check for image paths
      tx.executeSql(
        'SELECT ImagePath FROM steps WHERE ProjectID = ?',
        [projectId],
        async (_, { rows }) => {
          try {
            // Delete images if they exist
            for (let i = 0; i < rows.length; i++) {
              const imagePath = rows.item(i).ImagePath;
              if (imagePath) {
                DeleteImage(imagePath);
              }
            }

            // After deleting images, delete the steps
            tx.executeSql(
              'DELETE FROM steps WHERE ProjectID = ?',
              [projectId],
              (_, result) => {
                // After deleting steps, delete the project
                tx.executeSql(
                  'DELETE FROM projects WHERE ProjectID = ?',
                  [projectId],
                  (_, result) => {
                    resolve(result.rowsAffected); // Resolve with the number of projects deleted
                  },
                  (_, error) => reject(error) // Reject if there's an error deleting the project
                );
              },
              (_, error) => reject(error) // Reject if there's an error deleting the steps
            );
          } catch (error) {
            reject(error);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const saveProject = (projectId, value) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'UPDATE projects SET IsSaved = ? WHERE ProjectID = ?',
          [value, projectId],
          (_, result) => {
            resolve(result.rowsAffected); // Returns the number of rows affected
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const getSavedProjects = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT projects.*, categories.Name AS CategoryName FROM projects LEFT JOIN categories ON projects.CategoryID = categories.CategoryID WHERE projects.IsSaved = 1 ORDER BY projects.ProjectID DESC',
          [],
          (_, { rows }) => {
            const projects = rows._array;
            resolve(projects);
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

//------------------------- steps ----------------------------------------------------------

export const insertStep = async (notes, imageUri, id) => {
  const dateNow = new Date();
  const formattedDate = format(dateNow, "d MMM yyyy 'at' HH:mm");
  try {
    let imagePath = null;
    if (imageUri && imageUri !== undefined) {
      // Get the directory where you want to save the image
      const directory = `${FileSystem.documentDirectory}stepwise/images/`;
      // Create the directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      // Generate a unique file name for the image
      const imageName = `image_${Date.now()}.jpg`;
      // Construct the path where the image will be saved
      imagePath = directory + imageName;
      // Move the image to the directory with the generated name
      await FileSystem.moveAsync({ from: imageUri, to: imagePath });
    }

    // Insert data into SQLite
    return new Promise((resolve, reject) => {
      db.transaction(
        async tx => {
          // First, get the highest index for the current project
          const query = 'SELECT MAX(Position) as maxIndex FROM steps WHERE ProjectID = ?';
          tx.executeSql(
            query,
            [id],
            async (_, { rows }) => {
              let newIndex = 1; // Default index if no steps exist
              if (rows.length > 0 && rows.item(0).maxIndex != null) {
                newIndex = rows.item(0).maxIndex + 1;
              }

              // Now insert the new step with the calculated index
              tx.executeSql(
                'INSERT INTO steps (Notes, ImagePath, Date, ProjectID, Position) VALUES (?, ?, ?, ?, ?)',
                [notes, imagePath, formattedDate, id, newIndex],
                (_, { insertId }) => {
                  resolve(insertId); // Returns the ID of the inserted row
                },
                (_, error) => reject(error)
              );
            },
            (_, error) => reject(error)
          );
        },
        error => reject(error)
      );
    });
  } catch (error) {
    console.error('Error saving image and inserting into SQLite:', error);
    throw new Error('Failed to save image and insert into SQLite');
  }
};

export const fetchSteps = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute the first query to fetch steps
        tx.executeSql(
          'SELECT * FROM steps WHERE ProjectID = ? ORDER BY Position ASC',
          [id],
          (_, { rows: { _array: steps } }) => {
            // Execute the second query to fetch projects
            tx.executeSql(
              'SELECT * FROM projects WHERE ProjectID = ?',
              [id],
              (_, { rows: { _array: projects } }) => {
                // Combine steps and projects before resolving
                const result = { steps, projects: projects[0] };
                resolve(result);
              },
              (_, error) => reject(error)
            );
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

async function DeleteImage(url) {
  try {
    await FileSystem.deleteAsync(url);
    return { success: true };
  } catch (error) {
    console.error("Error Deleting Image:", error);
    return { success: false, error: error };
  }
}

export const deleteStep = async (stepId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // First, fetch the step to get the image path
        tx.executeSql(
          'SELECT ImagePath FROM steps WHERE StepID = ?',
          [stepId],
          (_, { rows }) => {
            const imagePath = rows.item(0).ImagePath;
            // Delete the step
            tx.executeSql(
              'DELETE FROM steps WHERE StepID = ?',
              [stepId],
              async (_, result) => {
                // If the step had an image, delete the image file
                if (imagePath) {
                  await DeleteImage(imagePath)
                  resolve(result.rowsAffected);
                } else {
                  resolve(result.rowsAffected);
                }
              },
              (_, error) => reject(error)
            );
          },
          (_, error) => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const updateStep = async (notes, imageUri, StepID, ischange, currentImagePath) => {
  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      try {
        let newImagePath = imageUri;
        // If there's a change and a current image, delete the current image
        if (currentImagePath && ischange) {
          DeleteImage(currentImagePath)
        }

        if (ischange && imageUri && imageUri !== undefined) {
          // Get the directory where you want to save the image
          const directory = `${FileSystem.documentDirectory}stepwise/images/`;
          // Generate a unique file name for the image
          const imageName = `image_${Date.now()}.jpg`;
          // Construct the path where the image will be saved
          newImagePath = directory + imageName;
          // Move the image to the directory with the generated name
          await FileSystem.moveAsync({ from: imageUri, to: newImagePath });
        }

        // Update the step with new details
        tx.executeSql(
          'UPDATE steps SET Notes = ?, ImagePath = ? WHERE StepID = ?',
          [notes, newImagePath, StepID],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      } catch (error) {
        console.error('Error updating step:', error);
        reject(new Error('Failed to update step'));
      }
    });
  });
};

export const updateStepPosition = async (steps) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        steps.forEach((step) => {
          tx.executeSql(
            'UPDATE steps SET Position = ? WHERE StepID = ?',
            [step.Position, step.StepID],
            (_, result) => { resolve(result.rowsAffected) },
            (_, error) => reject(error)
          );
        });
      },
      error => reject(error),
      () => resolve(true)
    );
  });
};