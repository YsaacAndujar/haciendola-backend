import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text', {
        unique: true,
    })
    handle: string;
    
    @Column('text')
    title: string;
    
    @Column('text')
    description: string;
    
    @Column('text')
    sku: string;
    
    @Column('float')
    grams: number;
    
    @Column('int')
    stock: number;
    
    @Column('float')
    price: number;
    
    @Column('float')
    comparePrice: number;
    
    @Column('text',{nullable: true,})
    barcode: string;

    // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // @Column('Date')
    // createdAt: Date;
}
