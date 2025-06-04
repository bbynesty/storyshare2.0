#pragma once

// Отключаем устаревшие функции Boost.Asio
#define BOOST_ASIO_NO_DEPRECATED

// Используем io_context вместо io_service
#define CROW_USE_IO_CONTEXT

// Включаем необходимые заголовки
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/ssl.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/ssl.hpp>
#include <boost/beast/websocket.hpp>

// Определяем io_service как алиас для io_context для обратной совместимости
namespace boost::asio {
    using io_service = io_context;
}

// Отключаем предупреждения
#ifdef _MSC_VER
    #pragma warning(disable: 4244) // преобразование типов
    #pragma warning(disable: 4267) // преобразование size_t
    #pragma warning(disable: 4456) // скрытие переменной
    #pragma warning(disable: 4458) // скрытие параметра
#endif

// Включаем оригинальный заголовок Crow
#include "crow.h" 