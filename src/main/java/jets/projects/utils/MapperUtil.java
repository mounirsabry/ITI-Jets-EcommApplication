package jets.projects.utils;

import jets.projects.beans.BookBean;
import jets.projects.client_dto.BookDto;
import jets.projects.client_dto.BookImageDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class MapperUtil {


    public static BookBean convertToBookBean(BookDto dto)
    {
        BookBean bean = new BookBean();
        bean.setId(dto.getBookId().intValue());
        bean.setTitle(dto.getTitle());
        bean.setAuthor(dto.getAuthor());
        bean.setPublisher(dto.getPublisher());
        bean.setIsbn(dto.getIsbn());
        bean.setGenre(dto.getGenre());
        bean.setPrice(BigDecimal.valueOf(dto.getPrice().doubleValue()));
        bean.setDiscount(dto.getDiscountedPercentage() != null ? dto.getDiscountedPercentage(): BigDecimal.valueOf(0));
        bean.setQuantity(dto.getStock());
        bean.setStatus(dto.getIsAvailable() ? "Available" : "Unavailable");
        bean.setMainImage(dto.getImages() != null && !dto.getImages().isEmpty() ? dto.getImages().get(0).getUrl() : "default.jpg");
        bean.setImages(new ArrayList<>(dto.getImages().stream().map(BookImageDto::getUrl).collect(Collectors.toList())));
        bean.setPublicationDate(dto.getPublicationDate().toString());
        bean.setLanguage(dto.getLanguage());
        bean.setPages(dto.getNumberOfPages());
        bean.setOverview(dto.getOverview());
        bean.setDescription(dto.getDescription());
        return bean;
    }
    public static BookDto convertToBookDto(BookBean bean) {
        BookDto dto = new BookDto();
        dto.setBookId((long) bean.getId());
        dto.setTitle(bean.getTitle());
        dto.setAuthor(bean.getAuthor());
        dto.setGenre(bean.getGenre());
        dto.setPublisher(bean.getPublisher());
        dto.setPublicationDate(LocalDate.parse(bean.getPublicationDate()));
        dto.setIsbn(bean.getIsbn());
        dto.setDescription(bean.getDescription());
        dto.setOverview(bean.getOverview());
        dto.setNumberOfPages(bean.getPages());
        dto.setLanguage(bean.getLanguage());
        dto.setIsAvailable("Available".equalsIgnoreCase(bean.getStatus()));
        dto.setStock(bean.getQuantity());
        dto.setPrice(bean.getPrice());
        dto.setDiscountedPercentage(bean.getDiscount());
        dto.setCopiesSold(0);
        List<BookImageDto> images = bean.getImages().stream()
                .map(url -> {
                    BookImageDto img = new BookImageDto();
                    img.setUrl(url);
                    img.setIsMain(url.equals(bean.getMainImage()));
                    return img;
                })
                .collect(Collectors.toList());
        dto.setImages(images);
        return dto;
    }
}
