module.exports = (sequelize, DataTypes) => {
  const PostOurWork = sequelize.define('PostOurWork', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val) {
        this.setDataValue('images', JSON.stringify(val));
      }
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'PostOurWorks',
  });
  return PostOurWork;
};
