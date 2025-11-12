package ke.co.smartlaundry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportDTO {
    private double totalRevenue;
    private double revenueThisMonth;
    private double revenueThisWeek;
    private double revenueToday;
    private List<RevenueBreakdownDTO> breakdowns;
}
