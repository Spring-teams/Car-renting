package net.springteam.CarRenting.dao;

import net.springteam.CarRenting.model.Car;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.List;

public class CarDao {
    private DataSource dataSource;
    private JdbcTemplate template;
    public CarDao(DataSource ds){
        this.dataSource=ds;
        this.template= new JdbcTemplate(this.dataSource);
    }
    public void insert(Car car){
        String SQL="insert into Car (carId,adminId,categoryId,price,carName,branch,numberSeat,image) values(?,?,?,?,?,?,?,?)";
        this.template.update(SQL,car.getCarID(),car.getAdminID(),car.getPrice(),car.getCarName(),car.getBranch(),car.getNumberSeat(),car.getImage());
    }
    public List<Car> getAllCar(){
        String SQL="select * from car inner join category on car.categoryId=category.categoryId";
        List<Car> cars=this.template.query(SQL,new CarMapper());
        return cars;
    }
    public Car getCarById(String id){
        String SQL="select * from car inner  join category  on car.categoryId=category.categoryId where car.carId= ?;";
        return this.template.queryForObject(SQL,new CarMapper(),id);
    }
}
