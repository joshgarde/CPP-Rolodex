'use strict';
const axios = require('axios');
const { Model } = require('sequelize');

const SOLR_SERVERS_URL = process.env.SOLR_SERVERS_URL;

module.exports = (sequelize, DataTypes) => {
  class Server extends Model {
    static async search(query) {
      let response = await axios.get(SOLR_SERVERS_URL, {
        params: {
          q: `(name:${encodeURIComponent(query)} OR description:${encodeURIComponent(query)}) AND public:true`,
          rows: 5
        }
      });

      let data = response.data;
      if (data.responseHeader.status != 0) {
        throw new Error(`Search returned: ${data.responseHeader.status}`);
      }

      let docs = data.response.docs;
      let results = [];
      for (let i = 0; i < docs.length; i++) {
        try {
          let server = await Server.findOne({where: {id: docs[i].id}});
          results.push(server);
        } catch (err) { /* ignore errors silently; db should clean on next index */ }
      }

      return results;
    }

    static associate(models) {
      // define association here
    }
  };
  Server.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    description: {
      type: DataTypes.STRING(140)
    },
    invite: {
      type: DataTypes.STRING(20)
    },
    defaultChannel: {
      type: DataTypes.BIGINT
    },
    public: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Server',
  });
  return Server;
};
