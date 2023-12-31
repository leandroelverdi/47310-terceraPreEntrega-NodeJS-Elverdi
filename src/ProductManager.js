import fs from "fs";
import { __dirname } from "./utils.js";

class ProductManager {
  constructor(path) {
    this.path = __dirname + path;
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts({});
      let id;
      if (!products.length) {
        id = 1;
      } else {
        id = products[products.length - 1].id + 1;
      }
      const newProduct = { id, ...product };
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      return error;
    }
  }

  async getProducts(limit) {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
      } else return [];
    } catch (error) {
      return error;
    }
  }

  async updateProduct(idProduct, productObj) {
    try {
      const products = await this.getProducts();

      const productIndex = products.findIndex(
        (product) => product.id === idProduct
      );

      if (productIndex !== -1) {
        const product = products[productIndex];
        products = { ...product, ...productObj };

        await fs.promises.writeFile(this.path, JSON.stringify(products));
      } else {
        return -1;
      }
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(idProduct) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === +idProduct);
      if (!product) {
        return -1;
      }

      const existProduct = products.findIndex(
        (product) => product.id === +idProduct
      );

      if (existProduct !== -1) {
        const newArrayProduct = products.filter(
          (product) => product.id !== +idProduct
        );
        await fs.promises.writeFile(this.path, JSON.stringify(newArrayProduct));
        return product;
      } else {
        return console.log("El producto que desea eliminar no existe");
      }
    } catch (error) {
      return error;
    }
  }

  async getProductById(idProduct) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === idProduct);
      return product;
    } catch (error) {
      return error;
    }
  }
}

export const productManager = new ProductManager("/ProductsFile.json");
