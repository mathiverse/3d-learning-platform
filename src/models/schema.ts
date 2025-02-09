export const schema = {
  models: {
    StudentProgress: {
      name: "StudentProgress",
      fields: {
        id: { type: "ID", isRequired: true },
        userId: { type: "String", isRequired: true },
        discipline: { type: "String", isRequired: true },
        completedModels: { type: "String", isArray: true },
        quizScores: { type: "Int", isArray: true },
        lastAccessed: { type: "AWSDateTime" },
        totalTimeSpent: { type: "Int" },
      },
      syncable: true,
    },
    Model3D: {
      name: "Model3D",
      fields: {
        id: { type: "ID", isRequired: true },
        name: { type: "String", isRequired: true },
        discipline: { type: "String", isRequired: true },
        difficulty: { type: "Int", isRequired: true },
        modelUrl: { type: "String", isRequired: true },
        description: { type: "String" },
        learningObjectives: { type: "String", isArray: true },
      },
      syncable: true,
    },
  },
}; 