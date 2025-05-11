"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const subjects = [
      "Physics",
      "Biology",
      "English",
      "History",
      "Geography",
      "Computer Science",
      "Economics",
      "Political Science",
    ];

    const subjectData = subjects.map((name, index) => ({
      id: index + 1,
      subject_name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Subjects", subjectData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Subjects", null, {});
  },
};
