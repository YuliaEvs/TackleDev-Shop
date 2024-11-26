import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { strict } from 'assert';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  currentCategoryName: string = "";

  constructor(private productService: ProductService, 
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(){
    
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //search for products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts(){

      // Check if "id" parameter is avaliable
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

      if (hasCategoryId) {
        // Get the "id" param string.convert string to a number using the "+" symbol
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        // Get the "name" param string
        this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      }
      else {
        //not category id avaliable ... default to category id 1
        this.currentCategoryId = 1;
        this.currentCategoryName = 'Books';
      }
  
      // now get the products for the given category id
       this.productService.getProductList(this.currentCategoryId).subscribe(
        data => {
          this.products = data;
        }   
      )
  }

}
