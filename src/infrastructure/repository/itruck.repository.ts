import { Container } from '../../domain/container';
import { Truck } from '../../domain/truck';
import { TruckStatus } from '../../domain/truckStatus';

export interface ITruckRepository {
  /**
   * Creates a new truck in the repository
   * @param truck The truck to create
   */
  create(truck: Truck): Promise<Truck>;

  /**
   * Updates the container that is on the truck
   * @param plate The plate of the truck
   * @param container The container that is currently on the truck
   */
  updateContainer(plate: string, container?: Container): Promise<Truck>;

  /**
   * Updates the status of the truck
   * @param plate The plate of the truck
   * @param newStatus The new status of the truck
   */
  updateStatus(plate: string, newStatus: TruckStatus): Promise<Truck>;

  /**
   * Gets all the trucks
   */
  getAll(): Promise<Truck[]>;

  /**
   * Finds a truck by license plate
   * @param plate The plate of the truck
   */
  findByLicensePlate(plate: string): Promise<Truck>;

  /**
   * Checks if a truck with the license plate already exists
   * @param plate The plate to check
   */
  exists(plate: string): Promise<boolean>;

  /**
   * Removes a truck
   * @param plate The plate of the truck
   * @returns The removed truck
   */
  removeTruck(plate: string): Promise<Truck>;
}
