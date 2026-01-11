import { PivotMockDataItem, PivotSimpleDataItem, PivotRemoteDataItem } from '../models/pivot-mock-data.model';

export const MOCK_DATA: PivotMockDataItem[] = [
    {
        'AllProducts': 'All', 'USA': 829, 'Uruguay': 524, 'Bulgaria': 282,
        'AllSeller_records': [
            {
                'AllSeller': 'All Sellers',
                'USA': 829, 'Uruguay': 524, 'Bulgaria': 282,
                'AllSeller_records': [
                    { 'SellerName': 'David', 'USA': 293 },
                    { 'SellerName': 'Lydia', 'Uruguay': 68 },
                    { 'SellerName': 'Elisa', 'USA': 296 },
                    { 'SellerName': 'Larry', 'Uruguay': 456 },
                    { 'SellerName': 'Stanley', 'Bulgaria': 282 },
                    { 'SellerName': 'John', 'USA': 240 }
                ]
            }
        ],
        'AllProducts_records': [
            {
                'ProductCategory': 'Accessories',
                'USA': 293,
                'AllSeller_records': [
                    {
                        'AllSeller': 'All Sellers', 'USA': 293,
                        'AllSeller_records': [{ 'SellerName': 'David', 'USA': 293 }]
                    }
                ],
            },
            {
                'ProductCategory': 'Bikes', 'Uruguay': 68,
                'AllSeller_records': [
                    {
                        'AllSeller': 'All Sellers', 'Uruguay': 68,
                        'AllSeller_records': [{ 'SellerName': 'Lydia', 'Uruguay': 68 }]
                    }
                ]
            },
            {
                'ProductCategory': 'Clothing', 'USA': 296, 'Uruguay': 456, 'Bulgaria': 282,
                'AllSeller_records': [
                    {
                        'AllSeller': 'All Sellers', 'USA': 296, 'Uruguay': 456, 'Bulgaria': 282,
                        'AllSeller_records': [
                            { 'SellerName': 'Elisa', 'USA': 296 },
                            { 'SellerName': 'Larry', 'Uruguay': 456 },
                            { 'SellerName': 'Stanley', 'Bulgaria': 282 }
                        ]
                    }
                ]
            },
            {
                'ProductCategory': 'Components', 'USA': 240,
                'AllSeller_records': [
                    {
                        'AllSeller': 'All Sellers', 'USA': 240,
                        'AllSeller_records': [
                            {
                                'SellerName': 'John', 'USA': 240
                            }]
                    }
                ]
            }
        ],
    }
];

export const DATA: PivotSimpleDataItem[] = [
    {
        AllProducts: 'All Products', All: 2127, 'Bulgaria': 774, 'USA': 829, 'Uruguay': 524, 'AllProducts_records': [
            { ProductCategory: 'Clothing', All: 1523, 'Bulgaria': 774, 'USA': 296, 'Uruguay': 456, },
            { ProductCategory: 'Bikes', All: 68, 'Uruguay': 68 },
            { ProductCategory: 'Accessories', All: 293, 'USA': 293 },
            { ProductCategory: 'Components', All: 240, 'USA': 240 }
        ]
    }
];

export const MOCK_REMOTE_DATA_DIFFERENT_SEPARATOR: PivotRemoteDataItem[] = [
    {
        AllProducts: 'All Products', All: 2127, 'All_Country-Bulgaria': 774, 'All_Country-USA': 829, 'All_Country-Uruguay': 524, 'AllProducts-records': [
            { ProductCategory: 'Clothing', All: 1523, 'All_Country-Bulgaria': 774, 'All_Country-USA': 296, 'All_Country-Uruguay': 456, },
            { ProductCategory: 'Bikes', All: 68, 'All_Country-Uruguay': 68 },
            { ProductCategory: 'Accessories', All: 293, 'All_Country-USA': 293 },
            { ProductCategory: 'Components', All: 240, 'All_Country-USA': 240 }
        ]
    }
];

